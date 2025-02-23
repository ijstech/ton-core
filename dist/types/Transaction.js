"use strict";
/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeTransaction = exports.loadTransaction = void 0;
const Builder_1 = require("../boc/Builder");
const Dictionary_1 = require("../dict/Dictionary");
const AccountStatus_1 = require("./AccountStatus");
const CurrencyCollection_1 = require("./CurrencyCollection");
const HashUpdate_1 = require("./HashUpdate");
const Message_1 = require("./Message");
const TransactionDescription_1 = require("./TransactionDescription");
function loadTransaction(slice) {
    let raw = slice.asCell();
    if (slice.loadUint(4) !== 0x07) {
        throw Error('Invalid data');
    }
    let address = slice.loadUintBig(256);
    let lt = slice.loadUintBig(64);
    let prevTransactionHash = slice.loadUintBig(256);
    let prevTransactionLt = slice.loadUintBig(64);
    let now = slice.loadUint(32);
    let outMessagesCount = slice.loadUint(15);
    let oldStatus = (0, AccountStatus_1.loadAccountStatus)(slice);
    let endStatus = (0, AccountStatus_1.loadAccountStatus)(slice);
    let msgRef = slice.loadRef();
    let msgSlice = msgRef.beginParse();
    let inMessage = msgSlice.loadBit() ? (0, Message_1.loadMessage)(msgSlice.loadRef().beginParse()) : undefined;
    let outMessages = msgSlice.loadDict(Dictionary_1.Dictionary.Keys.Uint(15), Message_1.MessageValue);
    msgSlice.endParse();
    let totalFees = (0, CurrencyCollection_1.loadCurrencyCollection)(slice);
    let stateUpdate = (0, HashUpdate_1.loadHashUpdate)(slice.loadRef().beginParse());
    let description = (0, TransactionDescription_1.loadTransactionDescription)(slice.loadRef().beginParse());
    return {
        address,
        lt,
        prevTransactionHash,
        prevTransactionLt,
        now,
        outMessagesCount,
        oldStatus,
        endStatus,
        inMessage,
        outMessages,
        totalFees,
        stateUpdate,
        description,
        raw,
        hash: () => raw.hash(),
    };
}
exports.loadTransaction = loadTransaction;
function storeTransaction(src) {
    return (builder) => {
        builder.storeUint(0x07, 4);
        builder.storeUint(src.address, 256);
        builder.storeUint(src.lt, 64);
        builder.storeUint(src.prevTransactionHash, 256);
        builder.storeUint(src.prevTransactionLt, 64);
        builder.storeUint(src.now, 32);
        builder.storeUint(src.outMessagesCount, 15);
        builder.store((0, AccountStatus_1.storeAccountStatus)(src.oldStatus));
        builder.store((0, AccountStatus_1.storeAccountStatus)(src.endStatus));
        let msgBuilder = (0, Builder_1.beginCell)();
        if (src.inMessage) {
            msgBuilder.storeBit(true);
            msgBuilder.storeRef((0, Builder_1.beginCell)().store((0, Message_1.storeMessage)(src.inMessage)));
        }
        else {
            msgBuilder.storeBit(false);
        }
        msgBuilder.storeDict(src.outMessages);
        builder.storeRef(msgBuilder);
        builder.store((0, CurrencyCollection_1.storeCurrencyCollection)(src.totalFees));
        builder.storeRef((0, Builder_1.beginCell)().store((0, HashUpdate_1.storeHashUpdate)(src.stateUpdate)));
        builder.storeRef((0, Builder_1.beginCell)().store((0, TransactionDescription_1.storeTransactionDescription)(src.description)));
    };
}
exports.storeTransaction = storeTransaction;
