"use strict";
/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.wonderCalculator = void 0;
const BitString_1 = require("../BitString");
const CellType_1 = require("../CellType");
const LevelMask_1 = require("./LevelMask");
const exoticPruned_1 = require("./exoticPruned");
const exoticMerkleProof_1 = require("./exoticMerkleProof");
const descriptor_1 = require("./descriptor");
const crypto_1 = require("@ton/crypto");
const exoticMerkleUpdate_1 = require("./exoticMerkleUpdate");
const exoticLibrary_1 = require("./exoticLibrary");
//
// This function replicates unknown logic of resolving cell data
// https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/vm/cells/DataCell.cpp#L214
//
function wonderCalculator(type, bits, refs) {
    //
    // Resolving level mask
    //
    let levelMask;
    let pruned = null;
    if (type === CellType_1.CellType.Ordinary) {
        let mask = 0;
        for (let r of refs) {
            mask = mask | r.mask.value;
        }
        levelMask = new LevelMask_1.LevelMask(mask);
    }
    else if (type === CellType_1.CellType.PrunedBranch) {
        // Parse pruned
        pruned = (0, exoticPruned_1.exoticPruned)(bits, refs);
        // Load level
        levelMask = new LevelMask_1.LevelMask(pruned.mask);
    }
    else if (type === CellType_1.CellType.MerkleProof) {
        // Parse proof
        let loaded = (0, exoticMerkleProof_1.exoticMerkleProof)(bits, refs);
        // Load level
        levelMask = new LevelMask_1.LevelMask(refs[0].mask.value >> 1);
    }
    else if (type === CellType_1.CellType.MerkleUpdate) {
        // Parse update
        let loaded = (0, exoticMerkleUpdate_1.exoticMerkleUpdate)(bits, refs);
        // Load level
        levelMask = new LevelMask_1.LevelMask((refs[0].mask.value | refs[1].mask.value) >> 1);
    }
    else if (type === CellType_1.CellType.Library) {
        // Parse library
        let loaded = (0, exoticLibrary_1.exoticLibrary)(bits, refs);
        // Load level
        levelMask = new LevelMask_1.LevelMask();
    }
    else {
        throw new Error("Unsupported exotic type");
    }
    //
    // Calculate hashes and depths
    // NOTE: https://github.com/ton-blockchain/ton/blob/24dc184a2ea67f9c47042b4104bbb4d82289fac1/crypto/vm/cells/DataCell.cpp#L214
    //
    let depths = [];
    let hashes = [];
    let hashCount = type === CellType_1.CellType.PrunedBranch ? 1 : levelMask.hashCount;
    let totalHashCount = levelMask.hashCount;
    let hashIOffset = totalHashCount - hashCount;
    for (let levelI = 0, hashI = 0; levelI <= levelMask.level; levelI++) {
        if (!levelMask.isSignificant(levelI)) {
            continue;
        }
        if (hashI < hashIOffset) {
            hashI++;
            continue;
        }
        //
        // Bits
        //
        let currentBits;
        if (hashI === hashIOffset) {
            if (!(levelI === 0 || type === CellType_1.CellType.PrunedBranch)) {
                throw Error('Invalid');
            }
            currentBits = bits;
        }
        else {
            if (!(levelI !== 0 && type !== CellType_1.CellType.PrunedBranch)) {
                throw Error('Invalid: ' + levelI + ', ' + type);
            }
            currentBits = new BitString_1.BitString(hashes[hashI - hashIOffset - 1], 0, 256);
        }
        //
        // Depth
        //
        let currentDepth = 0;
        for (let c of refs) {
            let childDepth;
            if (type == CellType_1.CellType.MerkleProof || type == CellType_1.CellType.MerkleUpdate) {
                childDepth = c.depth(levelI + 1);
            }
            else {
                childDepth = c.depth(levelI);
            }
            currentDepth = Math.max(currentDepth, childDepth);
        }
        if (refs.length > 0) {
            currentDepth++;
        }
        //
        // Hash
        //
        let repr = (0, descriptor_1.getRepr)(bits, currentBits, refs, levelI, levelMask.apply(levelI).value, type);
        let hash = (0, crypto_1.sha256_sync)(repr);
        //
        // Persist next
        //
        let destI = hashI - hashIOffset;
        depths[destI] = currentDepth;
        hashes[destI] = hash;
        //
        // Next
        //
        hashI++;
    }
    //
    // Calculate hash and depth for all levels
    //
    let resolvedHashes = [];
    let resolvedDepths = [];
    if (pruned) {
        for (let i = 0; i < 4; i++) {
            const { hashIndex } = levelMask.apply(i);
            const { hashIndex: thisHashIndex } = levelMask;
            if (hashIndex !== thisHashIndex) {
                resolvedHashes.push(pruned.pruned[hashIndex].hash);
                resolvedDepths.push(pruned.pruned[hashIndex].depth);
            }
            else {
                resolvedHashes.push(hashes[0]);
                resolvedDepths.push(depths[0]);
            }
        }
    }
    else {
        for (let i = 0; i < 4; i++) {
            resolvedHashes.push(hashes[levelMask.apply(i).hashIndex]);
            resolvedDepths.push(depths[levelMask.apply(i).hashIndex]);
        }
    }
    //
    // Result
    //
    return {
        mask: levelMask,
        hashes: resolvedHashes,
        depths: resolvedDepths
    };
}
exports.wonderCalculator = wonderCalculator;
