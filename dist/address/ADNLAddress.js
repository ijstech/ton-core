"use strict";
/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADNLAddress = void 0;
const base32_1 = require("../utils/base32");
const crc16_1 = require("../utils/crc16");
class ADNLAddress {
    constructor(address) {
        this.toRaw = () => {
            return this.address.toString('hex').toUpperCase();
        };
        this.toString = () => {
            let data = Buffer.concat([Buffer.from([0x2D]), this.address]);
            let hash = (0, crc16_1.crc16)(data);
            data = Buffer.concat([data, hash]);
            return (0, base32_1.base32Encode)(data).slice(1);
        };
        if (address.length !== 32) {
            throw Error('Invalid address');
        }
        this.address = address;
    }
    static parseFriendly(src) {
        if (src.length !== 55) {
            throw Error('Invalid address');
        }
        // Decoding
        src = 'f' + src;
        let decoded = (0, base32_1.base32Decode)(src);
        if (decoded[0] !== 0x2d) {
            throw Error('Invalid address');
        }
        let gotHash = decoded.slice(33);
        let hash = (0, crc16_1.crc16)(decoded.slice(0, 33));
        if (!hash.equals(gotHash)) {
            throw Error('Invalid address');
        }
        return new ADNLAddress(decoded.slice(1, 33));
    }
    static parseRaw(src) {
        const data = Buffer.from(src, 'base64');
        return new ADNLAddress(data);
    }
    equals(b) {
        return this.address.equals(b.address);
    }
}
exports.ADNLAddress = ADNLAddress;
