"use strict";
/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeDict = exports.detectLabelType = exports.writeLabelSame = exports.writeLabelLong = exports.writeLabelShort = exports.buildTree = void 0;
const Builder_1 = require("../boc/Builder");
const findCommonPrefix_1 = require("./utils/findCommonPrefix");
//
// Tree Build
//
function pad(src, size) {
    while (src.length < size) {
        src = '0' + src;
    }
    return src;
}
function removePrefixMap(src, length) {
    if (length === 0) {
        return src;
    }
    else {
        let res = new Map();
        for (let k of src.keys()) {
            let d = src.get(k);
            res.set(k.slice(length), d);
        }
        return res;
    }
}
function forkMap(src, prefixLen) {
    if (src.size === 0) {
        throw Error('Internal inconsistency');
    }
    let left = new Map();
    let right = new Map();
    for (let [k, d] of src.entries()) {
        if (k[prefixLen] === '0') {
            left.set(k, d);
        }
        else {
            right.set(k, d);
        }
    }
    if (left.size === 0) {
        throw Error('Internal inconsistency. Left emtpy.');
    }
    if (right.size === 0) {
        throw Error('Internal inconsistency. Right emtpy.');
    }
    return { left, right };
}
function buildNode(src, prefixLen) {
    if (src.size === 0) {
        throw Error('Internal inconsistency');
    }
    if (src.size === 1) {
        return { type: 'leaf', value: Array.from(src.values())[0] };
    }
    let { left, right } = forkMap(src, prefixLen);
    return {
        type: 'fork',
        left: buildEdge(left, prefixLen + 1),
        right: buildEdge(right, prefixLen + 1)
    };
}
function buildEdge(src, prefixLen = 0) {
    if (src.size === 0) {
        throw Error('Internal inconsistency');
    }
    const label = (0, findCommonPrefix_1.findCommonPrefix)(Array.from(src.keys()), prefixLen);
    return { label, node: buildNode(src, label.length + prefixLen) };
}
function buildTree(src, keyLength) {
    // Convert map keys
    let converted = new Map();
    for (let k of Array.from(src.keys())) {
        const padded = pad(k.toString(2), keyLength);
        converted.set(padded, src.get(k));
    }
    // Calculate root label
    return buildEdge(converted);
}
exports.buildTree = buildTree;
//
// Serialization
//
function writeLabelShort(src, to) {
    // Header
    to.storeBit(0);
    // Unary length
    for (let i = 0; i < src.length; i++) {
        to.storeBit(1);
    }
    to.storeBit(0);
    // Value
    if (src.length > 0) {
        to.storeUint(BigInt('0b' + src), src.length);
    }
    return to;
}
exports.writeLabelShort = writeLabelShort;
function labelShortLength(src) {
    return 1 + src.length + 1 + src.length;
}
function writeLabelLong(src, keyLength, to) {
    // Header
    to.storeBit(1);
    to.storeBit(0);
    // Length
    let length = Math.ceil(Math.log2(keyLength + 1));
    to.storeUint(src.length, length);
    // Value
    if (src.length > 0) {
        to.storeUint(BigInt('0b' + src), src.length);
    }
    return to;
}
exports.writeLabelLong = writeLabelLong;
function labelLongLength(src, keyLength) {
    return 1 + 1 + Math.ceil(Math.log2(keyLength + 1)) + src.length;
}
function writeLabelSame(value, length, keyLength, to) {
    // Header
    to.storeBit(1);
    to.storeBit(1);
    // Value
    to.storeBit(value);
    // Length
    let lenLen = Math.ceil(Math.log2(keyLength + 1));
    to.storeUint(length, lenLen);
}
exports.writeLabelSame = writeLabelSame;
function labelSameLength(keyLength) {
    return 1 + 1 + 1 + Math.ceil(Math.log2(keyLength + 1));
}
function isSame(src) {
    if (src.length === 0 || src.length === 1) {
        return true;
    }
    for (let i = 1; i < src.length; i++) {
        if (src[i] !== src[0]) {
            return false;
        }
    }
    return true;
}
function detectLabelType(src, keyLength) {
    let kind = 'short';
    let kindLength = labelShortLength(src);
    let longLength = labelLongLength(src, keyLength);
    if (longLength < kindLength) {
        kindLength = longLength;
        kind = 'long';
    }
    if (isSame(src)) {
        let sameLength = labelSameLength(keyLength);
        if (sameLength < kindLength) {
            kindLength = sameLength;
            kind = 'same';
        }
    }
    return kind;
}
exports.detectLabelType = detectLabelType;
function writeLabel(src, keyLength, to) {
    let type = detectLabelType(src, keyLength);
    if (type === 'short') {
        writeLabelShort(src, to);
    }
    else if (type === 'long') {
        writeLabelLong(src, keyLength, to);
    }
    else if (type === 'same') {
        writeLabelSame(src[0] === '1', src.length, keyLength, to);
    }
}
function writeNode(src, keyLength, serializer, to) {
    if (src.type === 'leaf') {
        serializer(src.value, to);
    }
    if (src.type === 'fork') {
        const leftCell = (0, Builder_1.beginCell)();
        const rightCell = (0, Builder_1.beginCell)();
        writeEdge(src.left, keyLength - 1, serializer, leftCell);
        writeEdge(src.right, keyLength - 1, serializer, rightCell);
        to.storeRef(leftCell);
        to.storeRef(rightCell);
    }
}
function writeEdge(src, keyLength, serializer, to) {
    writeLabel(src.label, keyLength, to);
    writeNode(src.node, keyLength - src.label.length, serializer, to);
}
function serializeDict(src, keyLength, serializer, to) {
    const tree = buildTree(src, keyLength);
    writeEdge(tree, keyLength, serializer, to);
}
exports.serializeDict = serializeDict;
