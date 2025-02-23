"use strict";
/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const BitString_1 = require("../../boc/BitString");
const testAddress_1 = require("../../utils/testAddress");
const internalKeySerializer_1 = require("./internalKeySerializer");
describe('internalKeySerializer', () => {
    it('should serialize numbers', () => {
        let cs = [0, -1, 1, 123123123, -123123123];
        for (let c of cs) {
            expect((0, internalKeySerializer_1.deserializeInternalKey)((0, internalKeySerializer_1.serializeInternalKey)(c))).toBe(c);
        }
    });
    it('should serialize bignumbers', () => {
        let cs = [0n, -1n, 1n, 123123123n, -123123123n, 1231231231231237812683128376123n, -1231273612873681263871263871263n];
        for (let c of cs) {
            expect((0, internalKeySerializer_1.deserializeInternalKey)((0, internalKeySerializer_1.serializeInternalKey)(c))).toBe(c);
        }
    });
    it('should serialize addresses', () => {
        let cs = [(0, testAddress_1.testAddress)(0, '1'), (0, testAddress_1.testAddress)(-1, '1'), (0, testAddress_1.testAddress)(0, '2'), (0, testAddress_1.testAddress)(0, '4')];
        for (let c of cs) {
            expect((0, internalKeySerializer_1.deserializeInternalKey)((0, internalKeySerializer_1.serializeInternalKey)(c)).equals(c)).toBe(true);
        }
    });
    it('should serialize buffers', () => {
        let cs = [Buffer.from('00', 'hex'), Buffer.from('ff', 'hex'), Buffer.from('0f', 'hex'), Buffer.from('0f000011002233456611', 'hex')];
        for (let c of cs) {
            expect((0, internalKeySerializer_1.deserializeInternalKey)((0, internalKeySerializer_1.serializeInternalKey)(c)).equals(c)).toBe(true);
        }
    });
    it('should serialize bit strings', () => {
        let cs = [Buffer.from('00', 'hex'), Buffer.from('ff', 'hex'), Buffer.from('0f', 'hex'), Buffer.from('0f000011002233456611', 'hex')];
        for (let c of cs) {
            for (let i = 0; i < c.length * 8 - 1; i++) {
                let bs = new BitString_1.BitString(c, 0, c.length * 8 - i);
                const res = (0, internalKeySerializer_1.deserializeInternalKey)((0, internalKeySerializer_1.serializeInternalKey)(bs));
                expect(res.equals(bs)).toBe(true);
            }
        }
    });
});
