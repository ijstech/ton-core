"use strict";
/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeAccountStatusChange = exports.loadAccountStatusChange = void 0;
function loadAccountStatusChange(slice) {
    if (!slice.loadBit()) {
        return 'unchanged';
    }
    if (slice.loadBit()) {
        return 'deleted';
    }
    else {
        return 'frozen';
    }
}
exports.loadAccountStatusChange = loadAccountStatusChange;
function storeAccountStatusChange(src) {
    return (builder) => {
        if (src == 'unchanged') {
            builder.storeBit(0);
        }
        else if (src === 'frozen') {
            builder.storeBit(1);
            builder.storeBit(0);
        }
        else if (src === 'deleted') {
            builder.storeBit(1);
            builder.storeBit(1);
        }
        else {
            throw Error('Invalid account status change');
        }
    };
}
exports.storeAccountStatusChange = storeAccountStatusChange;
