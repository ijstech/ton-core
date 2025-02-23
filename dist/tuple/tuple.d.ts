/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Cell } from "../boc/Cell";
export declare type Tuple = {
    type: 'tuple';
    items: TupleItem[];
};
export declare type TupleItemNull = {
    type: 'null';
};
export declare type TupleItemInt = {
    type: 'int';
    value: bigint;
};
export declare type TupleItemNaN = {
    type: 'nan';
};
export declare type TupleItemCell = {
    type: 'cell';
    cell: Cell;
};
export declare type TupleItemSlice = {
    type: 'slice';
    cell: Cell;
};
export declare type TupleItemBuilder = {
    type: 'builder';
    cell: Cell;
};
export declare type TupleItem = TupleItemNull | TupleItemInt | TupleItemNaN | TupleItemCell | TupleItemSlice | TupleItemBuilder | Tuple;
export declare function serializeTuple(src: TupleItem[]): Cell;
export declare function parseTuple(src: Cell): TupleItem[];
