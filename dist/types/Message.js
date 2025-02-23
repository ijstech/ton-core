"use strict";
/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageValue = exports.storeMessage = exports.loadMessage = void 0;
const Builder_1 = require("../boc/Builder");
const CommonMessageInfo_1 = require("./CommonMessageInfo");
const StateInit_1 = require("./StateInit");
function loadMessage(slice) {
    const info = (0, CommonMessageInfo_1.loadCommonMessageInfo)(slice);
    let init = null;
    if (slice.loadBit()) {
        if (!slice.loadBit()) {
            init = (0, StateInit_1.loadStateInit)(slice);
        }
        else {
            init = (0, StateInit_1.loadStateInit)(slice.loadRef().beginParse());
        }
    }
    const body = slice.loadBit() ? slice.loadRef() : slice.asCell();
    return {
        info,
        init,
        body
    };
}
exports.loadMessage = loadMessage;
function storeMessage(message, opts) {
    return (builder) => {
        // Store CommonMsgInfo
        builder.store((0, CommonMessageInfo_1.storeCommonMessageInfo)(message.info));
        // Store init
        if (message.init) {
            builder.storeBit(true);
            let initCell = (0, Builder_1.beginCell)().store((0, StateInit_1.storeStateInit)(message.init));
            // Check if need to store it in ref
            let needRef = false;
            if (opts && opts.forceRef) {
                needRef = true;
            }
            else {
                needRef = builder.availableBits - 2 /* At least two bits for ref flags */ < initCell.bits + message.body.bits.length;
            }
            // Persist init
            if (needRef) {
                builder.storeBit(true);
                builder.storeRef(initCell);
            }
            else {
                builder.storeBit(false);
                builder.storeBuilder(initCell);
            }
        }
        else {
            builder.storeBit(false);
        }
        // Store body
        let needRef = false;
        if (opts && opts.forceRef) {
            needRef = true;
        }
        else {
            needRef = builder.availableBits - 1 /* At least one bit for ref flag */ < message.body.bits.length ||
                builder.refs + message.body.refs.length > 4;
        }
        if (needRef) {
            builder.storeBit(true);
            builder.storeRef(message.body);
        }
        else {
            builder.storeBit(false);
            builder.storeBuilder(message.body.asBuilder());
        }
    };
}
exports.storeMessage = storeMessage;
exports.MessageValue = {
    serialize(src, builder) {
        builder.storeRef((0, Builder_1.beginCell)()
            .store(storeMessage(src)));
    },
    parse(slice) {
        return loadMessage(slice.loadRef().beginParse());
    }
};
