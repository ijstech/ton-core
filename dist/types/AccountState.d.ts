/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Builder } from "../boc/Builder";
import { Slice } from "../boc/Slice";
import { StateInit } from "./StateInit";
export declare type AccountState = AccountStateUninit | AccountStateActive | AccountStateFrozen;
export declare type AccountStateUninit = {
    type: 'uninit';
};
export declare type AccountStateActive = {
    type: 'active';
    state: StateInit;
};
export declare type AccountStateFrozen = {
    type: 'frozen';
    stateHash: bigint;
};
export declare function loadAccountState(cs: Slice): AccountState;
export declare function storeAccountState(src: AccountState): (builder: Builder) => void;
