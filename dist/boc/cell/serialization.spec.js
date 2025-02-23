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
const serialization_1 = require("./serialization");
const fs_1 = __importDefault(require("fs"));
const Builder_1 = require("../Builder");
const CellType_1 = require("../CellType");
const exoticPruned_1 = require("./exoticPruned");
const Cell_1 = require("../Cell");
const wallets = [
    'B5EE9C72410101010044000084FF0020DDA4F260810200D71820D70B1FED44D0D31FD3FFD15112BAF2A122F901541044F910F2A2F80001D31F3120D74A96D307D402FB00DED1A4C8CB1FCBFFC9ED5441FDF089',
    'B5EE9C724101010100530000A2FF0020DD2082014C97BA9730ED44D0D70B1FE0A4F260810200D71820D70B1FED44D0D31FD3FFD15112BAF2A122F901541044F910F2A2F80001D31F3120D74A96D307D402FB00DED1A4C8CB1FCBFFC9ED54D0E2786F',
    'B5EE9C7241010101005F0000BAFF0020DD2082014C97BA218201339CBAB19C71B0ED44D0D31FD70BFFE304E0A4F260810200D71820D70B1FED44D0D31FD3FFD15112BAF2A122F901541044F910F2A2F80001D31F3120D74A96D307D402FB00DED1A4C8CB1FCBFFC9ED54B5B86E42',
    'B5EE9C724101010100570000AAFF0020DD2082014C97BA9730ED44D0D70B1FE0A4F2608308D71820D31FD31F01F823BBF263ED44D0D31FD3FFD15131BAF2A103F901541042F910F2A2F800029320D74A96D307D402FB00E8D1A4C8CB1FCBFFC9ED54A1370BB6',
    'B5EE9C724101010100630000C2FF0020DD2082014C97BA218201339CBAB19C71B0ED44D0D31FD70BFFE304E0A4F2608308D71820D31FD31F01F823BBF263ED44D0D31FD3FFD15131BAF2A103F901541042F910F2A2F800029320D74A96D307D402FB00E8D1A4C8CB1FCBFFC9ED54044CD7A1',
    'B5EE9C724101010100620000C0FF0020DD2082014C97BA9730ED44D0D70B1FE0A4F2608308D71820D31FD31FD31FF82313BBF263ED44D0D31FD31FD3FFD15132BAF2A15144BAF2A204F901541055F910F2A3F8009320D74A96D307D402FB00E8D101A4C8CB1FCB1FCBFFC9ED543FBE6EE0',
    'B5EE9C724101010100710000DEFF0020DD2082014C97BA218201339CBAB19F71B0ED44D0D31FD31F31D70BFFE304E0A4F2608308D71820D31FD31FD31FF82313BBF263ED44D0D31FD31FD3FFD15132BAF2A15144BAF2A204F901541055F910F2A3F8009320D74A96D307D402FB00E8D101A4C8CB1FCB1FCBFFC9ED5410BD6DAD'
];
describe('boc', () => {
    it('should parse wallet code', () => {
        for (let w of wallets) {
            let c = (0, serialization_1.deserializeBoc)(Buffer.from(w, 'hex'))[0];
            let b = (0, serialization_1.serializeBoc)(c, { idx: false, crc32: true });
            let c2 = (0, serialization_1.deserializeBoc)(b)[0];
            expect(c2.equals(c)).toBe(true);
        }
    });
    it('should parse largeBoc.txt', () => {
        let boc = Buffer.from(fs_1.default.readFileSync(__dirname + '/__testdata__/largeBoc.txt', 'utf8'), 'base64');
        let c = (0, serialization_1.deserializeBoc)(boc)[0];
        (0, serialization_1.serializeBoc)(c, { idx: false, crc32: true });
    });
    it('should parse manyCells.txt', () => {
        let boc = Buffer.from(fs_1.default.readFileSync(__dirname + '/__testdata__/manyCells.txt', 'utf8'), 'base64');
        let c = (0, serialization_1.deserializeBoc)(boc)[0];
        let b = (0, serialization_1.serializeBoc)(c, { idx: false, crc32: true });
        let c2 = (0, serialization_1.deserializeBoc)(b)[0];
        expect(c2.equals(c)).toBe(true);
    });
    it('should parse veryLarge.boc', () => {
        let boc = fs_1.default.readFileSync(__dirname + '/__testdata__/veryLarge.boc');
        let c = (0, serialization_1.deserializeBoc)(boc)[0];
        let b = (0, serialization_1.serializeBoc)(c, { idx: false, crc32: true });
        let c2 = (0, serialization_1.deserializeBoc)(b)[0];
        expect(c2.equals(c)).toBe(true);
    });
    it('should parse accountState.txt', () => {
        let boc = Buffer.from(fs_1.default.readFileSync(__dirname + '/__testdata__/accountState.txt', 'utf8'), 'base64');
        let c = (0, serialization_1.deserializeBoc)(boc)[0];
        let b = (0, serialization_1.serializeBoc)(c, { idx: false, crc32: true });
        let c2 = (0, serialization_1.deserializeBoc)(b)[0];
        expect(c2.equals(c)).toBe(true);
    });
    it('should parse accountProof.txt', () => {
        let boc = Buffer.from(fs_1.default.readFileSync(__dirname + '/__testdata__/accountProof.txt', 'utf8'), 'base64');
        let c = (0, serialization_1.deserializeBoc)(boc)[0];
        let b = (0, serialization_1.serializeBoc)(c, { idx: false, crc32: true });
        let c2 = (0, serialization_1.deserializeBoc)(b)[0];
        expect(c2.equals(c)).toBe(true);
    });
    it('should parse configProof.txt', () => {
        let boc = Buffer.from(fs_1.default.readFileSync(__dirname + '/__testdata__/configProof.txt', 'utf8'), 'base64');
        let c = (0, serialization_1.deserializeBoc)(boc)[0];
        let b = (0, serialization_1.serializeBoc)(c, { idx: false, crc32: true });
        let c2 = (0, serialization_1.deserializeBoc)(b)[0];
        expect(c2.equals(c)).toBe(true);
    });
    it('should parse accountStateTest.txt', () => {
        let boc = Buffer.from(fs_1.default.readFileSync(__dirname + '/__testdata__/accountStateTest.txt', 'utf8'), 'base64');
        let c = (0, serialization_1.deserializeBoc)(boc)[0];
        let b = (0, serialization_1.serializeBoc)(c, { idx: false, crc32: true });
        let c2 = (0, serialization_1.deserializeBoc)(b)[0];
        expect(c2.equals(c)).toBe(true);
    });
    it('should parse accountStateTestPruned.txt', () => {
        let boc = Buffer.from(fs_1.default.readFileSync(__dirname + '/__testdata__/accountStateTestPruned.txt', 'utf8'), 'base64');
        let c = (0, serialization_1.deserializeBoc)(boc)[0];
        let b = (0, serialization_1.serializeBoc)(c, { idx: false, crc32: true });
        let c2 = (0, serialization_1.deserializeBoc)(b)[0];
        expect(c2.equals(c)).toBe(true);
    });
    it('should match pruned state', () => {
        let prunedBoc = Buffer.from(fs_1.default.readFileSync(__dirname + '/__testdata__/accountStateTestPruned.txt', 'utf8'), 'base64');
        let pruned = (0, serialization_1.deserializeBoc)(prunedBoc)[0];
        let fullBoc = Buffer.from(fs_1.default.readFileSync(__dirname + '/__testdata__/accountStateTest.txt', 'utf8'), 'base64');
        let full = (0, serialization_1.deserializeBoc)(fullBoc)[0];
        expect(pruned.isExotic).toBe(true);
        expect(pruned.type).toBe(CellType_1.CellType.MerkleProof);
        let prunedData = pruned.beginParse(true).loadRef();
        // Load refs
        let sc = full.beginParse();
        let fullA = sc.loadRef();
        let fullB = sc.loadRef();
        let sc2 = prunedData.beginParse();
        let prunedA = sc2.loadRef();
        let prunedB = sc2.loadRef();
        let ppA = (0, exoticPruned_1.exoticPruned)(prunedA.bits, prunedA.refs);
        let ppB = (0, exoticPruned_1.exoticPruned)(prunedB.bits, prunedB.refs);
        // Check hashes
        expect(ppA.pruned[0].hash).toMatchObject(fullA.hash());
        expect(ppB.pruned[0].hash).toMatchObject(fullB.hash());
    });
    it('should serialize single cell with a empty bits', () => {
        let cell = (0, Builder_1.beginCell)().endCell();
        expect(cell.toString()).toBe('x{}');
        expect(cell.hash().toString('base64')).toBe('lqKW0iTyhcZ77pPDD4owkVfw2qNdxbh+QQt4YwoJz8c=');
        expect((0, serialization_1.serializeBoc)(cell, { idx: false, crc32: false }).toString('base64')).toBe('te6ccgEBAQEAAgAAAA==');
        expect((0, serialization_1.serializeBoc)(cell, { idx: false, crc32: true }).toString('base64')).toBe('te6cckEBAQEAAgAAAEysuc0=');
        expect((0, serialization_1.serializeBoc)(cell, { idx: true, crc32: false }).toString('base64')).toBe('te6ccoEBAQEAAgACAAA=');
        expect((0, serialization_1.serializeBoc)(cell, { idx: true, crc32: true }).toString('base64')).toBe('te6ccsEBAQEAAgACAAC4Afhr');
        expect((0, serialization_1.deserializeBoc)(Buffer.from('te6ccgEBAQEAAgAAAA==', 'base64'))[0].equals(cell)).toBe(true);
        expect((0, serialization_1.deserializeBoc)(Buffer.from('te6cckEBAQEAAgAAAEysuc0=', 'base64'))[0].equals(cell)).toBe(true);
        expect((0, serialization_1.deserializeBoc)(Buffer.from('te6ccoEBAQEAAgACAAA=', 'base64'))[0].equals(cell)).toBe(true);
        expect((0, serialization_1.deserializeBoc)(Buffer.from('te6ccsEBAQEAAgACAAC4Afhr', 'base64'))[0].equals(cell)).toBe(true);
    });
    it('should serialize single cell with a number of byte-aligned bits', () => {
        let cell = (0, Builder_1.beginCell)().storeUint(123456789, 32).endCell();
        expect(cell.toString()).toBe('x{075BCD15}');
        expect(cell.hash().toString('base64')).toBe('keNT38owvINaYYHwYjE1R8HYk0c1NSMH72u+/aMJ+1c=');
        expect((0, serialization_1.serializeBoc)(cell, { idx: false, crc32: false }).toString('base64')).toBe('te6ccgEBAQEABgAACAdbzRU=');
        expect((0, serialization_1.serializeBoc)(cell, { idx: false, crc32: true }).toString('base64')).toBe('te6cckEBAQEABgAACAdbzRVRblCS');
        expect((0, serialization_1.serializeBoc)(cell, { idx: true, crc32: false }).toString('base64')).toBe('te6ccoEBAQEABgAGAAgHW80V');
        expect((0, serialization_1.serializeBoc)(cell, { idx: true, crc32: true }).toString('base64')).toBe('te6ccsEBAQEABgAGAAgHW80ViGH1dQ==');
        expect((0, serialization_1.deserializeBoc)(Buffer.from('te6ccgEBAQEABgAACAdbzRU=', 'base64'))[0].equals(cell)).toBe(true);
        expect((0, serialization_1.deserializeBoc)(Buffer.from('te6cckEBAQEABgAACAdbzRVRblCS', 'base64'))[0].equals(cell)).toBe(true);
        expect((0, serialization_1.deserializeBoc)(Buffer.from('te6ccoEBAQEABgAGAAgHW80V', 'base64'))[0].equals(cell)).toBe(true);
        expect((0, serialization_1.deserializeBoc)(Buffer.from('te6ccsEBAQEABgAGAAgHW80ViGH1dQ==', 'base64'))[0].equals(cell)).toBe(true);
    });
    it('should serialize single cell with a number of non-aligned bits', () => {
        let cell = (0, Builder_1.beginCell)().storeUint(123456789, 34).endCell();
        expect(cell.toString()).toBe('x{01D6F3456_}');
        expect(cell.hash().toString('base64')).toBe('Rk+nt8kkAyN9S1v4H0zwFbGs2INwpMHvESvPQbrI6d0=');
        expect((0, serialization_1.serializeBoc)(cell, { idx: false, crc32: false }).toString('base64')).toBe('te6ccgEBAQEABwAACQHW80Vg');
        expect((0, serialization_1.serializeBoc)(cell, { idx: false, crc32: true }).toString('base64')).toBe('te6cckEBAQEABwAACQHW80Vgb11ZoQ==');
        expect((0, serialization_1.serializeBoc)(cell, { idx: true, crc32: false }).toString('base64')).toBe('te6ccoEBAQEABwAHAAkB1vNFYA==');
        expect((0, serialization_1.serializeBoc)(cell, { idx: true, crc32: true }).toString('base64')).toBe('te6ccsEBAQEABwAHAAkB1vNFYM0Si3w=');
        expect((0, serialization_1.deserializeBoc)(Buffer.from('te6ccgEBAQEABwAACQHW80Vg', 'base64'))[0].equals(cell)).toBe(true);
        expect((0, serialization_1.deserializeBoc)(Buffer.from('te6cckEBAQEABwAACQHW80Vgb11ZoQ==', 'base64'))[0].equals(cell)).toBe(true);
        expect((0, serialization_1.deserializeBoc)(Buffer.from('te6ccoEBAQEABwAHAAkB1vNFYA==', 'base64'))[0].equals(cell)).toBe(true);
        expect((0, serialization_1.deserializeBoc)(Buffer.from('te6ccsEBAQEABwAHAAkB1vNFYM0Si3w=', 'base64'))[0].equals(cell)).toBe(true);
    });
    it('should serialize single cell with a single reference', () => {
        let refCell = (0, Builder_1.beginCell)()
            .storeUint(123456789, 32)
            .endCell();
        let cell = (0, Builder_1.beginCell)()
            .storeUint(987654321, 32)
            .storeRef(refCell)
            .endCell();
        expect(cell.toString()).toBe('x{3ADE68B1}\n x{075BCD15}');
        expect(cell.hash().toString('base64')).toBe('goaQYcsXO2c/gd3qvMo3ncEjzpbU7urNQ7hPDo0qC1c=');
        expect((0, serialization_1.serializeBoc)(cell, { idx: false, crc32: false }).toString('base64')).toBe('te6ccgEBAgEADQABCDreaLEBAAgHW80V');
        expect((0, serialization_1.serializeBoc)(cell, { idx: false, crc32: true }).toString('base64')).toBe('te6cckEBAgEADQABCDreaLEBAAgHW80VSW/75w==');
        expect((0, serialization_1.serializeBoc)(cell, { idx: true, crc32: false }).toString('base64')).toBe('te6ccoEBAgEADQAHDQEIOt5osQEACAdbzRU=');
        expect((0, serialization_1.serializeBoc)(cell, { idx: true, crc32: true }).toString('base64')).toBe('te6ccsEBAgEADQAHDQEIOt5osQEACAdbzRUxP4cd');
        expect((0, serialization_1.deserializeBoc)(Buffer.from('te6ccgEBAgEADQABCDreaLEBAAgHW80V', 'base64'))[0].equals(cell)).toBe(true);
        expect((0, serialization_1.deserializeBoc)(Buffer.from('te6cckEBAgEADQABCDreaLEBAAgHW80VSW/75w==', 'base64'))[0].equals(cell)).toBe(true);
        expect((0, serialization_1.deserializeBoc)(Buffer.from('te6ccoEBAgEADQAABwEIOt5osQEACAdbzRU=', 'base64'))[0].equals(cell)).toBe(true);
        expect((0, serialization_1.deserializeBoc)(Buffer.from('te6ccsEBAgEADQAHDQEIOt5osQEACAdbzRUxP4cd', 'base64'))[0].equals(cell)).toBe(true);
    });
    it('should serialize single cell with multiple references', () => {
        let refCell = (0, Builder_1.beginCell)()
            .storeUint(123456789, 32)
            .endCell();
        let cell = (0, Builder_1.beginCell)()
            .storeUint(987654321, 32)
            .storeRef(refCell)
            .storeRef(refCell)
            .storeRef(refCell)
            .endCell();
        expect(cell.toString()).toBe('x{3ADE68B1}\n x{075BCD15}\n x{075BCD15}\n x{075BCD15}');
        expect(cell.hash().toString('base64')).toBe('cks0wbfqFZE9/yb0sWMWQGoj0XBOLkUi+aX5xpJ6jjA=');
        expect((0, serialization_1.serializeBoc)(cell, { idx: false, crc32: false }).toString('base64')).toBe('te6ccgEBAgEADwADCDreaLEBAQEACAdbzRU=');
        expect((0, serialization_1.serializeBoc)(cell, { idx: false, crc32: true }).toString('base64')).toBe('te6cckEBAgEADwADCDreaLEBAQEACAdbzRWpQD2p');
        expect((0, serialization_1.serializeBoc)(cell, { idx: true, crc32: false }).toString('base64')).toBe('te6ccoEBAgEADwAJDwMIOt5osQEBAQAIB1vNFQ==');
        expect((0, serialization_1.serializeBoc)(cell, { idx: true, crc32: true }).toString('base64')).toBe('te6ccsEBAgEADwAJDwMIOt5osQEBAQAIB1vNFZz9usI=');
        expect((0, serialization_1.deserializeBoc)(Buffer.from('te6ccgEBAgEADwADCDreaLEBAQEACAdbzRU=', 'base64'))[0].equals(cell)).toBe(true);
        expect((0, serialization_1.deserializeBoc)(Buffer.from('te6cckEBAgEADwADCDreaLEBAQEACAdbzRWpQD2p', 'base64'))[0].equals(cell)).toBe(true);
        expect((0, serialization_1.deserializeBoc)(Buffer.from('te6ccoEBAgEADwAACQMIOt5osQEBAQAIB1vNFQ==', 'base64'))[0].equals(cell)).toBe(true);
        expect((0, serialization_1.deserializeBoc)(Buffer.from('te6ccsEBAgEADwAJDwMIOt5osQEBAQAIB1vNFZz9usI=', 'base64'))[0].equals(cell)).toBe(true);
    });
    it('should deserialize/serialize library cell', () => {
        let cell = Cell_1.Cell.fromBase64('te6ccgEBAgEALQABDv8AiNDtHtgBCEICGbgzd5nhZ9WhSM+4juFCvgMYJOtxthFdtTKIH6M/6SM=');
        expect(cell.toString()).toBe('x{FF0088D0ED1ED8}\n x{0219B8337799E167D5A148CFB88EE142BE031824EB71B6115DB532881FA33FE923}');
        expect((0, serialization_1.serializeBoc)(cell, { idx: false, crc32: false }).toString('base64')).toBe('te6ccgEBAgEALQABDv8AiNDtHtgBCEICGbgzd5nhZ9WhSM+4juFCvgMYJOtxthFdtTKIH6M/6SM=');
    });
    it('should deserialize block (#21)', () => {
        let testCase = fs_1.default.readFileSync(__dirname + '/__testdata__/block.txt', 'utf8');
        let cell = Cell_1.Cell.fromBase64(testCase);
    });
    it('should hash tx with merkle body', () => {
        let testCase = JSON.parse(fs_1.default.readFileSync(__dirname + '/__testdata__/tx_with_merkle_body.json', 'utf8'));
        let boc = Buffer.from(testCase.boc, 'hex');
        let cell = Cell_1.Cell.fromBoc(boc)[0];
        expect(cell.hash().toString('hex')).toBe(testCase.hash);
    });
    it('should deserialize block 2', () => {
        let testCase = fs_1.default.readFileSync(__dirname + '/__testdata__/block2.txt', 'utf8');
        let cell = Cell_1.Cell.fromBase64(testCase);
        expect(cell.hash().toString('hex')).toBe('25e19f8c4574804a8cabade6bab736a27a67f4f6696a8a0feb93b3dfbfab7fcf');
    });
    it('should serialize boc with index', () => {
        let cell = (0, Builder_1.beginCell)()
            .storeUint(228, 32)
            .storeRef((0, Builder_1.beginCell)().storeUint(1337, 32).endCell())
            .storeRef((0, Builder_1.beginCell)().storeUint(1338, 32).endCell())
            .endCell();
        let serialized = cell.toBoc({ idx: true, crc32: false }).toString('hex');
        expect(cell.toString()).toBe('x{000000E4}\n x{00000539}\n x{0000053A}');
        expect(serialized).toBe('b5ee9c7281010301001400080e140208000000e4010200080000053900080000053a');
    });
    it('should deserialize cell from hex', () => {
        let cell = Cell_1.Cell.fromHex('b5ee9c7241010201000d00010800000001010008000000027d4b3cf8');
        expect(cell.toString()).toBe('x{00000001}\n x{00000002}');
    });
});
