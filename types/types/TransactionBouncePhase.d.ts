/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Builder } from "../boc/Builder";
import { Slice } from "../boc/Slice";
import { StorageUsedShort } from "./StorageUsedShort";
export declare type TransactionBouncePhase = TransactionBounceNegativeFunds | TransactionBounceNoFunds | TransactionBounceOk;
export declare type TransactionBounceNegativeFunds = {
    type: "negative-funds";
};
export declare type TransactionBounceNoFunds = {
    type: "no-funds";
    messageSize: StorageUsedShort;
    requiredForwardFees: bigint;
};
export declare type TransactionBounceOk = {
    type: "ok";
    messageSize: StorageUsedShort;
    messageFees: bigint;
    forwardFees: bigint;
};
export declare function loadTransactionBouncePhase(slice: Slice): TransactionBouncePhase;
export declare function storeTransactionBouncePhase(src: TransactionBouncePhase): (builder: Builder) => void;
