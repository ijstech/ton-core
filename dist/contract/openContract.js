"use strict";
/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.openContract = void 0;
const Address_1 = require("../address/Address");
const Cell_1 = require("../boc/Cell");
function openContract(src, factory) {
    // Resolve parameters
    let address;
    let init = null;
    if (!Address_1.Address.isAddress(src.address)) {
        throw Error('Invalid address');
    }
    address = src.address;
    if (src.init) {
        if (!(src.init.code instanceof Cell_1.Cell)) {
            throw Error('Invalid init.code');
        }
        if (!(src.init.data instanceof Cell_1.Cell)) {
            throw Error('Invalid init.data');
        }
        init = src.init;
    }
    // Create executor
    let executor = factory({ address, init });
    // Create proxy
    return new Proxy(src, {
        get(target, prop) {
            const value = target[prop];
            if (typeof prop === 'string' && (prop.startsWith('get') || prop.startsWith('send') || prop.startsWith('is'))) {
                if (typeof value === 'function') {
                    return (...args) => value.apply(target, [executor, ...args]);
                }
            }
            return value;
        }
    });
}
exports.openContract = openContract;
