/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Address } from "../address/Address";
import { StateInit } from "../types/StateInit";
import { Contract } from "./Contract";
import { ContractProvider } from "./ContractProvider";
export declare type OpenedContract<F> = {
    [P in keyof F]: P extends `${'get' | 'send' | 'is'}${string}` ? (F[P] extends (x: ContractProvider, ...args: infer P) => infer R ? (...args: P) => R : never) : F[P];
};
export declare function openContract<T extends Contract>(src: T, factory: (params: {
    address: Address;
    init: StateInit | null;
}) => ContractProvider): OpenedContract<T>;
