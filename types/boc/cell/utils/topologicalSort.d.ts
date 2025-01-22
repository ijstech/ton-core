/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Cell } from "../../Cell";
export declare function topologicalSort(src: Cell): {
    cell: Cell;
    refs: number[];
}[];
