"use strict";
/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Builder_1 = require("../boc/Builder");
const Cell_1 = require("../boc/Cell");
const StateInit_1 = require("./StateInit");
describe('StateInit', () => {
    it('shoild serialize to match golden-1', () => {
        // Serialize
        let boc = (0, Builder_1.beginCell)()
            .store((0, StateInit_1.storeStateInit)({
            code: (0, Builder_1.beginCell)().storeUint(1, 8).endCell(),
            data: (0, Builder_1.beginCell)().storeUint(2, 8).endCell()
        }))
            .endCell()
            .toBoc({ idx: false, crc32: true });
        expect(boc.toString('base64')).toEqual('te6cckEBAwEACwACATQBAgACAQACAoN/wQo=');
        // Parse
        let parsed = (0, StateInit_1.loadStateInit)(Cell_1.Cell.fromBoc(boc)[0].beginParse());
        expect(parsed.libraries).toBeUndefined();
        expect(parsed.special).toBeUndefined();
        expect(parsed.splitDepth).toBeUndefined();
        let codeSlice = parsed.code.beginParse();
        let a = codeSlice.loadUint(8);
        expect(a).toBe(1);
        codeSlice.endParse();
        let dataSlice = parsed.data.beginParse();
        let b = dataSlice.loadUint(8);
        expect(b).toBe(2);
        dataSlice.endParse();
    });
});
