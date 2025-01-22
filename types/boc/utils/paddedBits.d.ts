/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { BitString } from "../BitString";
export declare function bitsToPaddedBuffer(bits: BitString): Buffer<ArrayBufferLike>;
export declare function paddedBufferToBits(buff: Buffer): BitString;
