/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/// <reference types="node" />
import { TupleItem } from "./tuple";
export declare class TupleReader {
    private readonly items;
    constructor(items: TupleItem[]);
    get remaining(): number;
    peek(): TupleItem;
    pop(): TupleItem;
    skip(num?: number): this;
    readBigNumber(): bigint;
    readBigNumberOpt(): bigint;
    readNumber(): number;
    readNumberOpt(): number;
    readBoolean(): boolean;
    readBooleanOpt(): boolean;
    readAddress(): import("..").Address;
    readAddressOpt(): import("..").Address;
    readCell(): import("..").Cell;
    readCellOpt(): import("..").Cell;
    readTuple(): TupleReader;
    readTupleOpt(): TupleReader;
    private static readLispList;
    readLispListDirect(): TupleItem[];
    readLispList(): TupleItem[];
    readBuffer(): Buffer;
    readBufferOpt(): Buffer;
    readString(): string;
    readStringOpt(): string;
}
