"use strict";
/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalAddress = void 0;
class ExternalAddress {
    constructor(value, bits) {
        this.value = value;
        this.bits = bits;
    }
    static isAddress(src) {
        return src instanceof ExternalAddress;
    }
    toString() {
        return `External<${this.bits}:${this.value}>`;
    }
}
exports.ExternalAddress = ExternalAddress;
