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
    readBigNumberOpt(): bigint | null;
    readNumber(): number;
    readNumberOpt(): number | null;
    readBoolean(): boolean;
    readBooleanOpt(): boolean | null;
    readAddress(): import("@ton/core").Address;
    readAddressOpt(): import("@ton/core").Address | null;
    readCell(): import("@ton/core").Cell;
    readCellOpt(): import("@ton/core").Cell | null;
    readTuple(): TupleReader;
    readTupleOpt(): TupleReader | null;
    private static readLispList;
    readLispListDirect(): TupleItem[];
    readLispList(): TupleItem[];
    readBuffer(): Buffer;
    readBufferOpt(): Buffer | null;
    readString(): string;
    readStringOpt(): string | null;
}
