"use strict";
/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Builder_1 = require("../boc/Builder");
const Cell_1 = require("../boc/Cell");
const exoticMerkleProof_1 = require("../boc/cell/exoticMerkleProof");
const exoticMerkleUpdate_1 = require("../boc/cell/exoticMerkleUpdate");
const Dictionary_1 = require("./Dictionary");
const fs_1 = __importDefault(require("fs"));
const BitString_1 = require("../boc/BitString");
function storeBits(builder, src) {
    for (let s of src) {
        if (s === '0') {
            builder.storeBit(0);
        }
        else {
            builder.storeBit(1);
        }
    }
    return builder;
}
describe('Dictionary', () => {
    it('should parse and serialize dict from example', () => {
        let root = storeBits((0, Builder_1.beginCell)(), '11001000')
            .storeRef(storeBits((0, Builder_1.beginCell)(), '011000')
            .storeRef(storeBits((0, Builder_1.beginCell)(), '1010011010000000010101001'))
            .storeRef(storeBits((0, Builder_1.beginCell)(), '1010000010000000100100001')))
            .storeRef(storeBits((0, Builder_1.beginCell)(), '1011111011111101111100100001'))
            .endCell();
        // Unpack
        let dict = Dictionary_1.Dictionary.loadDirect(Dictionary_1.Dictionary.Keys.Uint(16), Dictionary_1.Dictionary.Values.Uint(16), root.beginParse());
        expect(dict.get(13)).toBe(169);
        expect(dict.get(17)).toBe(289);
        expect(dict.get(239)).toBe(57121);
        // Empty
        let fromEmpty = Dictionary_1.Dictionary.empty();
        fromEmpty.set(13, 169);
        fromEmpty.set(17, 289);
        fromEmpty.set(239, 57121);
        // Pack
        let packed = (0, Builder_1.beginCell)()
            .storeDictDirect(dict)
            .endCell();
        let packed2 = (0, Builder_1.beginCell)()
            .storeDictDirect(fromEmpty, Dictionary_1.Dictionary.Keys.Uint(16), Dictionary_1.Dictionary.Values.Uint(16))
            .endCell();
        // Compare
        expect(packed.equals(root)).toBe(true);
        expect(packed2.equals(root)).toBe(true);
    });
    it('should parse config', () => {
        let cell = Cell_1.Cell.fromBoc(Buffer.from(fs_1.default.readFileSync(__dirname + '/__testdata__/config.txt', 'utf-8'), 'base64'))[0];
        let configs = cell.beginParse().loadDictDirect(Dictionary_1.Dictionary.Keys.Int(32), Dictionary_1.Dictionary.Values.Cell());
        let ids = [0, 1, 2, 4, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25, 28, 29, 31, 32, 34, 71, 72, -999, -71];
        let keys = configs.keys();
        for (let i of ids) {
            expect(keys).toContain(i);
            expect(configs.get(i)).not.toBeUndefined();
            expect(configs.has(i)).toBe(true);
        }
    });
    it('should parse bridge config', () => {
        let cell = Cell_1.Cell.fromBoc(Buffer.from(fs_1.default.readFileSync(__dirname + '/__testdata__/config.txt', 'utf-8'), 'base64'))[0];
        let configs = cell.beginParse().loadDictDirect(Dictionary_1.Dictionary.Keys.Int(32), Dictionary_1.Dictionary.Values.Cell());
        for (let i of [71, 72]) {
            let r = configs.get(i);
            let config = r.beginParse();
            let bridgeAddress = config.loadBuffer(32);
            let oracleMultisigAddress = config.loadBuffer(32);
            let oracles = config.loadDict(Dictionary_1.Dictionary.Keys.BigUint(256), Dictionary_1.Dictionary.Values.Buffer(32));
            let externalChainAddress = config.loadBuffer(32);
            // console.warn(oracles);
        }
    });
    it('should parse dictionary with empty values', () => {
        let cell = Cell_1.Cell.fromBoc(Buffer.from(fs_1.default.readFileSync(__dirname + "/__testdata__/empty_value.boc")))[0];
        let testDict = Dictionary_1.Dictionary.loadDirect(Dictionary_1.Dictionary.Keys.BigUint(256), Dictionary_1.Dictionary.Values.BitString(0), cell);
        expect(testDict.keys()[0]).toEqual(123n);
        expect(testDict.get(123n).length).toBe(0);
    });
    it('should correctly serialize BitString keys and values', () => {
        const keyLen = 9; // Not 8 bit aligned
        const keys = Dictionary_1.Dictionary.Keys.BitString(keyLen);
        const values = Dictionary_1.Dictionary.Values.BitString(72);
        let testKey = new BitString_1.BitString(Buffer.from("Test"), 0, keyLen);
        let testVal = new BitString_1.BitString(Buffer.from("BitString"), 0, 72);
        let testDict = Dictionary_1.Dictionary.empty(keys, values);
        testDict.set(testKey, testVal);
        expect(testDict.get(testKey).equals(testVal)).toBe(true);
        let serialized = (0, Builder_1.beginCell)().storeDictDirect(testDict).endCell();
        let dictDs = Dictionary_1.Dictionary.loadDirect(keys, values, serialized);
        expect(dictDs.get(testKey).equals(testVal)).toBe(true);
    });
    it('should generate merkle proofs', () => {
        let d = Dictionary_1.Dictionary.empty(Dictionary_1.Dictionary.Keys.Uint(8), Dictionary_1.Dictionary.Values.Uint(32));
        d.set(1, 11);
        d.set(2, 22);
        d.set(3, 33);
        d.set(4, 44);
        d.set(5, 55);
        const dictHash = (0, Builder_1.beginCell)().storeDictDirect(d).endCell().hash();
        for (let k = 1; k <= 5; k++) {
            const proof = d.generateMerkleProof([k]);
            Cell_1.Cell.fromBoc(proof.toBoc());
            expect((0, exoticMerkleProof_1.exoticMerkleProof)(proof.bits, proof.refs).proofHash).toEqual(dictHash);
            // todo: parse the pruned dictionary and check the presence of the keys
        }
        for (let k = 1; k <= 3; k++) {
            const proof = d.generateMerkleProof([k, k + 1, k + 2]);
            Cell_1.Cell.fromBoc(proof.toBoc());
            expect((0, exoticMerkleProof_1.exoticMerkleProof)(proof.bits, proof.refs).proofHash).toEqual(dictHash);
        }
        expect(() => d.generateMerkleProof([6])).toThrow();
    });
    it('should generate merkle updates', () => {
        let d = Dictionary_1.Dictionary.empty(Dictionary_1.Dictionary.Keys.Uint(8), Dictionary_1.Dictionary.Values.Uint(32));
        d.set(1, 11);
        d.set(2, 22);
        d.set(3, 33);
        d.set(4, 44);
        d.set(5, 55);
        for (let k = 1; k <= 5; k++) {
            const update = d.generateMerkleUpdate(k, d.get(k) * 2);
            Cell_1.Cell.fromBoc(update.toBoc());
            expect((0, exoticMerkleUpdate_1.exoticMerkleUpdate)(update.bits, update.refs).proofHash1).toEqual(Buffer.from('ee41b86bd71f8224ebd01848b4daf4cd46d3bfb3e119d8b865ce7c2802511de3', 'hex'));
            d.set(k, Math.floor(d.get(k) / 2));
        }
    });
});
