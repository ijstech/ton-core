"use strict";
/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitReader = void 0;
const Address_1 = require("../address/Address");
const ExternalAddress_1 = require("../address/ExternalAddress");
/**
 * Class for reading bit strings
 */
class BitReader {
    constructor(bits, offset = 0) {
        this._checkpoints = [];
        this._bits = bits;
        this._offset = offset;
    }
    /**
     * Offset in source bit string
     */
    get offset() {
        return this._offset;
    }
    /**
     * Number of bits remaining
     */
    get remaining() {
        return this._bits.length - this._offset;
    }
    /**
     * Skip bits
     * @param bits number of bits to skip
     */
    skip(bits) {
        if (bits < 0 || this._offset + bits > this._bits.length) {
            throw new Error(`Index ${this._offset + bits} is out of bounds`);
        }
        this._offset += bits;
    }
    /**
     * Reset to the beginning or latest checkpoint
     */
    reset() {
        if (this._checkpoints.length > 0) {
            this._offset = this._checkpoints.pop();
        }
        else {
            this._offset = 0;
        }
    }
    /**
     * Save checkpoint
     */
    save() {
        this._checkpoints.push(this._offset);
    }
    /**
     * Load a single bit
     * @returns true if the bit is set, false otherwise
     */
    loadBit() {
        let r = this._bits.at(this._offset);
        this._offset++;
        return r;
    }
    /**
     * Preload bit
     * @returns true if the bit is set, false otherwise
     */
    preloadBit() {
        return this._bits.at(this._offset);
    }
    /**
     * Load bit string
     * @param bits number of bits to read
     * @returns new bitstring
     */
    loadBits(bits) {
        let r = this._bits.substring(this._offset, bits);
        this._offset += bits;
        return r;
    }
    /**
     * Preload bit string
     * @param bits number of bits to read
     * @returns new bitstring
     */
    preloadBits(bits) {
        return this._bits.substring(this._offset, bits);
    }
    /**
     * Load buffer
     * @param bytes number of bytes
     * @returns new buffer
     */
    loadBuffer(bytes) {
        let buf = this._preloadBuffer(bytes, this._offset);
        this._offset += bytes * 8;
        return buf;
    }
    /**
     * Preload buffer
     * @param bytes number of bytes
     * @returns new buffer
     */
    preloadBuffer(bytes) {
        return this._preloadBuffer(bytes, this._offset);
    }
    /**
     * Load uint value
     * @param bits uint bits
     * @returns read value as number
     */
    loadUint(bits) {
        return this._toSafeInteger(this.loadUintBig(bits), 'loadUintBig');
    }
    /**
     * Load uint value as bigint
     * @param bits uint bits
     * @returns read value as bigint
     */
    loadUintBig(bits) {
        let loaded = this.preloadUintBig(bits);
        this._offset += bits;
        return loaded;
    }
    /**
     * Preload uint value
     * @param bits uint bits
     * @returns read value as number
     */
    preloadUint(bits) {
        return this._toSafeInteger(this._preloadUint(bits, this._offset), 'preloadUintBig');
    }
    /**
     * Preload uint value as bigint
     * @param bits uint bits
     * @returns read value as bigint
     */
    preloadUintBig(bits) {
        return this._preloadUint(bits, this._offset);
    }
    /**
     * Load int value
     * @param bits int bits
     * @returns read value as bigint
     */
    loadInt(bits) {
        let res = this._preloadInt(bits, this._offset);
        this._offset += bits;
        return this._toSafeInteger(res, 'loadUintBig');
    }
    /**
     * Load int value as bigint
     * @param bits int bits
     * @returns read value as bigint
     */
    loadIntBig(bits) {
        let res = this._preloadInt(bits, this._offset);
        this._offset += bits;
        return res;
    }
    /**
     * Preload int value
     * @param bits int bits
     * @returns read value as bigint
     */
    preloadInt(bits) {
        return this._toSafeInteger(this._preloadInt(bits, this._offset), 'preloadIntBig');
    }
    /**
     * Preload int value
     * @param bits int bits
     * @returns read value as bigint
     */
    preloadIntBig(bits) {
        return this._preloadInt(bits, this._offset);
    }
    /**
     * Load varuint value
     * @param bits number of bits to read the size
     * @returns read value as bigint
     */
    loadVarUint(bits) {
        let size = Number(this.loadUint(bits));
        return this._toSafeInteger(this.loadUintBig(size * 8), 'loadVarUintBig');
    }
    /**
     * Load varuint value
     * @param bits number of bits to read the size
     * @returns read value as bigint
     */
    loadVarUintBig(bits) {
        let size = Number(this.loadUint(bits));
        return this.loadUintBig(size * 8);
    }
    /**
     * Preload varuint value
     * @param bits number of bits to read the size
     * @returns read value as bigint
     */
    preloadVarUint(bits) {
        let size = Number(this._preloadUint(bits, this._offset));
        return this._toSafeInteger(this._preloadUint(size * 8, this._offset + bits), 'preloadVarUintBig');
    }
    /**
     * Preload varuint value
     * @param bits number of bits to read the size
     * @returns read value as bigint
     */
    preloadVarUintBig(bits) {
        let size = Number(this._preloadUint(bits, this._offset));
        return this._preloadUint(size * 8, this._offset + bits);
    }
    /**
     * Load varint value
     * @param bits number of bits to read the size
     * @returns read value as bigint
     */
    loadVarInt(bits) {
        let size = Number(this.loadUint(bits));
        return this._toSafeInteger(this.loadIntBig(size * 8), 'loadVarIntBig');
    }
    /**
     * Load varint value
     * @param bits number of bits to read the size
     * @returns read value as bigint
     */
    loadVarIntBig(bits) {
        let size = Number(this.loadUint(bits));
        return this.loadIntBig(size * 8);
    }
    /**
     * Preload varint value
     * @param bits number of bits to read the size
     * @returns read value as bigint
     */
    preloadVarInt(bits) {
        let size = Number(this._preloadUint(bits, this._offset));
        return this._toSafeInteger(this._preloadInt(size * 8, this._offset + bits), 'preloadVarIntBig');
    }
    /**
     * Preload varint value
     * @param bits number of bits to read the size
     * @returns read value as bigint
     */
    preloadVarIntBig(bits) {
        let size = Number(this._preloadUint(bits, this._offset));
        return this._preloadInt(size * 8, this._offset + bits);
    }
    /**
     * Load coins value
     * @returns read value as bigint
     */
    loadCoins() {
        return this.loadVarUintBig(4);
    }
    /**
     * Preload coins value
     * @returns read value as bigint
     */
    preloadCoins() {
        return this.preloadVarUintBig(4);
    }
    /**
     * Load Address
     * @returns Address
     */
    loadAddress() {
        let type = Number(this._preloadUint(2, this._offset));
        if (type === 2) {
            return this._loadInternalAddress();
        }
        else {
            throw new Error("Invalid address: " + type);
        }
    }
    /**
     * Load internal address
     * @returns Address or null
     */
    loadMaybeAddress() {
        let type = Number(this._preloadUint(2, this._offset));
        if (type === 0) {
            this._offset += 2;
            return null;
        }
        else if (type === 2) {
            return this._loadInternalAddress();
        }
        else {
            throw new Error("Invalid address");
        }
    }
    /**
     * Load external address
     * @returns ExternalAddress
     */
    loadExternalAddress() {
        let type = Number(this._preloadUint(2, this._offset));
        if (type === 1) {
            return this._loadExternalAddress();
        }
        else {
            throw new Error("Invalid address");
        }
    }
    /**
     * Load external address
     * @returns ExternalAddress or null
     */
    loadMaybeExternalAddress() {
        let type = Number(this._preloadUint(2, this._offset));
        if (type === 0) {
            this._offset += 2;
            return null;
        }
        else if (type === 1) {
            return this._loadExternalAddress();
        }
        else {
            throw new Error("Invalid address");
        }
    }
    /**
     * Read address of any type
     * @returns Address or ExternalAddress or null
     */
    loadAddressAny() {
        let type = Number(this._preloadUint(2, this._offset));
        if (type === 0) {
            this._offset += 2;
            return null;
        }
        else if (type === 2) {
            return this._loadInternalAddress();
        }
        else if (type === 1) {
            return this._loadExternalAddress();
        }
        else if (type === 3) {
            throw Error('Unsupported');
        }
        else {
            throw Error('Unreachable');
        }
    }
    /**
     * Load bit string that was padded to make it byte alligned. Used in BOC serialization
     * @param bytes number of bytes to read
     */
    loadPaddedBits(bits) {
        // Check that number of bits is byte alligned
        if (bits % 8 !== 0) {
            throw new Error("Invalid number of bits");
        }
        // Skip padding
        let length = bits;
        while (true) {
            if (this._bits.at(this._offset + length - 1)) {
                length--;
                break;
            }
            else {
                length--;
            }
        }
        // Read substring
        let r = this._bits.substring(this._offset, length);
        this._offset += bits;
        return r;
    }
    /**
     * Clone BitReader
     */
    clone() {
        return new BitReader(this._bits, this._offset);
    }
    /**
     * Preload int from specific offset
     * @param bits bits to preload
     * @param offset offset to start from
     * @returns read value as bigint
     */
    _preloadInt(bits, offset) {
        if (bits == 0) {
            return 0n;
        }
        let sign = this._bits.at(offset);
        let res = 0n;
        for (let i = 0; i < bits - 1; i++) {
            if (this._bits.at(offset + 1 + i)) {
                res += 1n << BigInt(bits - i - 1 - 1);
            }
        }
        if (sign) {
            res = res - (1n << BigInt(bits - 1));
        }
        return res;
    }
    /**
     * Preload uint from specific offset
     * @param bits bits to preload
     * @param offset offset to start from
     * @returns read value as bigint
     */
    _preloadUint(bits, offset) {
        if (bits == 0) {
            return 0n;
        }
        let res = 0n;
        for (let i = 0; i < bits; i++) {
            if (this._bits.at(offset + i)) {
                res += 1n << BigInt(bits - i - 1);
            }
        }
        return res;
    }
    _preloadBuffer(bytes, offset) {
        // Try to load fast
        let fastBuffer = this._bits.subbuffer(offset, bytes * 8);
        if (fastBuffer) {
            return fastBuffer;
        }
        // Load slow
        let buf = Buffer.alloc(bytes);
        for (let i = 0; i < bytes; i++) {
            buf[i] = Number(this._preloadUint(8, offset + i * 8));
        }
        return buf;
    }
    _loadInternalAddress() {
        let type = Number(this._preloadUint(2, this._offset));
        if (type !== 2) {
            throw Error('Invalid address');
        }
        // No Anycast supported
        if (this._preloadUint(1, this._offset + 2) !== 0n) {
            throw Error('Invalid address');
        }
        // Read address
        let wc = Number(this._preloadInt(8, this._offset + 3));
        let hash = this._preloadBuffer(32, this._offset + 11);
        // Update offset
        this._offset += 267;
        return new Address_1.Address(wc, hash);
    }
    _loadExternalAddress() {
        let type = Number(this._preloadUint(2, this._offset));
        if (type !== 1) {
            throw Error('Invalid address');
        }
        // Load length
        let bits = Number(this._preloadUint(9, this._offset + 2));
        // Load address
        let value = this._preloadUint(bits, this._offset + 11);
        // Update offset
        this._offset += 11 + bits;
        return new ExternalAddress_1.ExternalAddress(value, bits);
    }
    _toSafeInteger(src, alt) {
        if (BigInt(Number.MAX_SAFE_INTEGER) < src || src < BigInt(Number.MIN_SAFE_INTEGER)) {
            throw new TypeError(`${src} is out of safe integer range. Use ${alt} instead`);
        }
        return Number(src);
    }
}
exports.BitReader = BitReader;
