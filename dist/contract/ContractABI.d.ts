/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Maybe } from "../utils/maybe";
export declare type ABIError = {
    message: string;
};
export declare type ABITypeRef = {
    kind: 'simple';
    type: string;
    optional?: Maybe<boolean>;
    format?: Maybe<string | number | boolean>;
} | {
    kind: 'dict';
    format?: Maybe<string | number | boolean>;
    key: string;
    keyFormat?: Maybe<string | number | boolean>;
    value: string;
    valueFormat?: Maybe<string | number | boolean>;
};
export declare type ABIField = {
    name: string;
    type: ABITypeRef;
};
export declare type ABIType = {
    name: string;
    header?: Maybe<number>;
    fields: ABIField[];
};
export declare type ABIArgument = {
    name: string;
    type: ABITypeRef;
};
export declare type ABIGetter = {
    name: string;
    methodId?: Maybe<number>;
    arguments?: Maybe<ABIArgument[]>;
    returnType?: Maybe<ABITypeRef>;
};
export declare type ABIReceiverMessage = {
    kind: 'typed';
    type: string;
} | {
    kind: 'any';
} | {
    kind: 'empty';
} | {
    kind: 'text';
    text?: Maybe<string>;
};
export declare type ABIReceiver = {
    receiver: 'internal' | 'external';
    message: ABIReceiverMessage;
};
export declare type ContractABI = {
    name?: Maybe<string>;
    types?: Maybe<ABIType[]>;
    errors?: Maybe<{
        [key: number]: ABIError;
    }>;
    getters?: Maybe<ABIGetter[]>;
    receivers?: Maybe<ABIReceiver[]>;
};
