"use strict";
/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRepr = exports.getBitsDescriptor = exports.getRefsDescriptor = void 0;
const CellType_1 = require("../CellType");
const paddedBits_1 = require("../utils/paddedBits");
function getRefsDescriptor(refs, levelMask, type) {
    return refs.length + (type !== CellType_1.CellType.Ordinary ? 1 : 0) * 8 + levelMask * 32;
}
exports.getRefsDescriptor = getRefsDescriptor;
function getBitsDescriptor(bits) {
    let len = bits.length;
    return Math.ceil(len / 8) + Math.floor(len / 8);
}
exports.getBitsDescriptor = getBitsDescriptor;
function getRepr(originalBits, bits, refs, level, levelMask, type) {
    // Allocate
    const bitsLen = Math.ceil(bits.length / 8);
    const repr = Buffer.alloc(2 + bitsLen + (2 + 32) * refs.length);
    // Write descriptors
    let reprCursor = 0;
    repr[reprCursor++] = getRefsDescriptor(refs, levelMask, type);
    repr[reprCursor++] = getBitsDescriptor(originalBits);
    // Write bits
    (0, paddedBits_1.bitsToPaddedBuffer)(bits).copy(repr, reprCursor);
    reprCursor += bitsLen;
    // Write refs
    for (const c of refs) {
        let childDepth;
        if (type == CellType_1.CellType.MerkleProof || type == CellType_1.CellType.MerkleUpdate) {
            childDepth = c.depth(level + 1);
        }
        else {
            childDepth = c.depth(level);
        }
        repr[reprCursor++] = Math.floor(childDepth / 256);
        repr[reprCursor++] = childDepth % 256;
    }
    for (const c of refs) {
        let childHash;
        if (type == CellType_1.CellType.MerkleProof || type == CellType_1.CellType.MerkleUpdate) {
            childHash = c.hash(level + 1);
        }
        else {
            childHash = c.hash(level);
        }
        childHash.copy(repr, reprCursor);
        reprCursor += 32;
    }
    // Result
    return repr;
}
exports.getRepr = getRepr;
