"use strict";
/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeSignVerify = exports.safeSign = void 0;
const crypto_1 = require("@ton/crypto");
const MIN_SEED_LENGTH = 8;
const MAX_SEED_LENGTH = 64;
function createSafeSignHash(cell, seed) {
    let seedData = Buffer.from(seed);
    if (seedData.length > MAX_SEED_LENGTH) {
        throw Error('Seed can\t be longer than 64 bytes');
    }
    if (seedData.length < MIN_SEED_LENGTH) {
        throw Error('Seed must be at least 8 bytes');
    }
    return (0, crypto_1.sha256_sync)(Buffer.concat([Buffer.from([0xff, 0xff]), seedData, cell.hash()]));
}
function safeSign(cell, secretKey, seed = 'ton-safe-sign-magic') {
    return (0, crypto_1.sign)(createSafeSignHash(cell, seed), secretKey);
}
exports.safeSign = safeSign;
function safeSignVerify(cell, signature, publicKey, seed = 'ton-safe-sign-magic') {
    return (0, crypto_1.signVerify)(createSafeSignHash(cell, seed), signature, publicKey);
}
exports.safeSignVerify = safeSignVerify;
