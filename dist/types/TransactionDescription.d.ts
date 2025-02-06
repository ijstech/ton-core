/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Builder } from "../boc/Builder";
import { Slice } from "../boc/Slice";
import { Maybe } from "../utils/maybe";
import { SplitMergeInfo } from "./SplitMergeInfo";
import { Transaction } from "./Transaction";
import { TransactionActionPhase } from "./TransactionActionPhase";
import { TransactionBouncePhase } from "./TransactionBouncePhase";
import { TransactionComputePhase } from "./TransactionComputePhase";
import { TransactionCreditPhase } from "./TransactionCreditPhase";
import { TransactionStoragePhase } from "./TransactionStoragePhase";
export declare type TransactionDescription = TransactionDescriptionGeneric | TransactionDescriptionStorage | TransactionDescriptionTickTock | TransactionDescriptionSplitPrepare | TransactionDescriptionSplitInstall | TransactionDescriptionMergePrepare | TransactionDescriptionMergeInstall;
export declare type TransactionDescriptionGeneric = {
    type: "generic";
    creditFirst: boolean;
    storagePhase?: Maybe<TransactionStoragePhase>;
    creditPhase?: Maybe<TransactionCreditPhase>;
    computePhase: TransactionComputePhase;
    actionPhase?: Maybe<TransactionActionPhase>;
    bouncePhase?: Maybe<TransactionBouncePhase>;
    aborted: boolean;
    destroyed: boolean;
};
export declare type TransactionDescriptionStorage = {
    type: "storage";
    storagePhase: TransactionStoragePhase;
};
export declare type TransactionDescriptionTickTock = {
    type: "tick-tock";
    isTock: boolean;
    storagePhase: TransactionStoragePhase;
    computePhase: TransactionComputePhase;
    actionPhase?: Maybe<TransactionActionPhase>;
    aborted: boolean;
    destroyed: boolean;
};
export declare type TransactionDescriptionSplitPrepare = {
    type: "split-prepare";
    splitInfo: SplitMergeInfo;
    storagePhase?: Maybe<TransactionStoragePhase>;
    computePhase: TransactionComputePhase;
    actionPhase?: Maybe<TransactionActionPhase>;
    aborted: boolean;
    destroyed: boolean;
};
export declare type TransactionDescriptionSplitInstall = {
    type: "split-install";
    splitInfo: SplitMergeInfo;
    prepareTransaction: Transaction;
    installed: boolean;
};
export declare type TransactionDescriptionMergePrepare = {
    type: "merge-prepare";
    splitInfo: SplitMergeInfo;
    storagePhase: TransactionStoragePhase;
    aborted: boolean;
};
export declare type TransactionDescriptionMergeInstall = {
    type: "merge-install";
    splitInfo: SplitMergeInfo;
    prepareTransaction: Transaction;
    storagePhase?: Maybe<TransactionStoragePhase>;
    creditPhase?: Maybe<TransactionCreditPhase>;
    computePhase: TransactionComputePhase;
    actionPhase?: Maybe<TransactionActionPhase>;
    aborted: boolean;
    destroyed: boolean;
};
export declare function loadTransactionDescription(slice: Slice): TransactionDescription;
export declare function storeTransactionDescription(src: TransactionDescription): (builder: Builder) => void;
