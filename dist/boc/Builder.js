"use strict";
/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Builder = exports.beginCell = void 0;
const BitBuilder_1 = require("./BitBuilder");
const Cell_1 = require("./Cell");
const strings_1 = require("./utils/strings");
/**
 * Start building a cell
 * @returns a new builder
 */
function beginCell() {
    return new Builder();
}
exports.beginCell = beginCell;
/**
 * Builder for Cells
 */
class Builder {
    constructor() {
        this._bits = new BitBuilder_1.BitBuilder();
        this._refs = [];
    }
    /**
     * Bits written so far
     */
    get bits() {
        return this._bits.length;
    }
    /**
     * References written so far
     */
    get refs() {
        return this._refs.length;
    }
    /**
     * Available bits
     */
    get availableBits() {
        return 1023 - this.bits;
    }
    /**
     * Available references
     */
    get availableRefs() {
        return 4 - this.refs;
    }
    /**
     * Write a single bit
     * @param value bit to write, true or positive number for 1, false or zero or negative for 0
     * @returns this builder
     */
    storeBit(value) {
        this._bits.writeBit(value);
        return this;
    }
    /**
     * Write bits from BitString
     * @param src source bits
     * @returns this builder
     */
    storeBits(src) {
        this._bits.writeBits(src);
        return this;
    }
    /**
     * Store Buffer
     * @param src source buffer
     * @param bytes optional number of bytes to write
     * @returns this builder
     */
    storeBuffer(src, bytes) {
        if (bytes !== undefined && bytes !== null) {
            if (src.length !== bytes) {
                throw Error(`Buffer length ${src.length} is not equal to ${bytes}`);
            }
        }
        this._bits.writeBuffer(src);
        return this;
    }
    /**
     * Store Maybe Buffer
     * @param src source buffer or null
     * @param bytes optional number of bytes to write
     * @returns this builder
     */
    storeMaybeBuffer(src, bytes) {
        if (src !== null) {
            this.storeBit(1);
            this.storeBuffer(src, bytes);
        }
        else {
            this.storeBit(0);
        }
        return this;
    }
    /**
     * Store uint value
     * @param value value as bigint or number
     * @param bits number of bits to write
     * @returns this builder
     */
    storeUint(value, bits) {
        this._bits.writeUint(value, bits);
        return this;
    }
    /**
     * Store maybe uint value
     * @param value value as bigint or number, null or undefined
     * @param bits number of bits to write
     * @returns this builder
     */
    storeMaybeUint(value, bits) {
        if (value !== null && value !== undefined) {
            this.storeBit(1);
            this.storeUint(value, bits);
        }
        else {
            this.storeBit(0);
        }
        return this;
    }
    /**
     * Store int value
     * @param value value as bigint or number
     * @param bits number of bits to write
     * @returns this builder
     */
    storeInt(value, bits) {
        this._bits.writeInt(value, bits);
        return this;
    }
    /**
     * Store maybe int value
     * @param value value as bigint or number, null or undefined
     * @param bits number of bits to write
     * @returns this builder
     */
    storeMaybeInt(value, bits) {
        if (value !== null && value !== undefined) {
            this.storeBit(1);
            this.storeInt(value, bits);
        }
        else {
            this.storeBit(0);
        }
        return this;
    }
    /**
     * Store varuint value
     * @param value value as bigint or number
     * @param bits number of bits to write to header
     * @returns this builder
     */
    storeVarUint(value, bits) {
        this._bits.writeVarUint(value, bits);
        return this;
    }
    /**
     * Store maybe varuint value
     * @param value value as bigint or number, null or undefined
     * @param bits number of bits to write to header
     * @returns this builder
     */
    storeMaybeVarUint(value, bits) {
        if (value !== null && value !== undefined) {
            this.storeBit(1);
            this.storeVarUint(value, bits);
        }
        else {
            this.storeBit(0);
        }
        return this;
    }
    /**
     * Store varint value
     * @param value value as bigint or number
     * @param bits number of bits to write to header
     * @returns this builder
     */
    storeVarInt(value, bits) {
        this._bits.writeVarInt(value, bits);
        return this;
    }
    /**
     * Store maybe varint value
     * @param value value as bigint or number, null or undefined
     * @param bits number of bits to write to header
     * @returns this builder
     */
    storeMaybeVarInt(value, bits) {
        if (value !== null && value !== undefined) {
            this.storeBit(1);
            this.storeVarInt(value, bits);
        }
        else {
            this.storeBit(0);
        }
        return this;
    }
    /**
     * Store coins value
     * @param amount amount of coins
     * @returns this builder
     */
    storeCoins(amount) {
        this._bits.writeCoins(amount);
        return this;
    }
    /**
     * Store maybe coins value
     * @param amount amount of coins, null or undefined
     * @returns this builder
     */
    storeMaybeCoins(amount) {
        if (amount !== null && amount !== undefined) {
            this.storeBit(1);
            this.storeCoins(amount);
        }
        else {
            this.storeBit(0);
        }
        return this;
    }
    /**
     * Store address
     * @param addres address to store
     * @returns this builder
     */
    storeAddress(address) {
        this._bits.writeAddress(address);
        return this;
    }
    /**
     * Store reference
     * @param cell cell or builder to store
     * @returns this builder
     */
    storeRef(cell) {
        // Check refs
        if (this._refs.length >= 4) {
            throw new Error("Too many references");
        }
        // Store reference
        if (cell instanceof Cell_1.Cell) {
            this._refs.push(cell);
        }
        else if (cell instanceof Builder) {
            this._refs.push(cell.endCell());
        }
        else {
            throw new Error("Invalid argument");
        }
        return this;
    }
    /**
     * Store reference if not null
     * @param cell cell or builder to store
     * @returns this builder
     */
    storeMaybeRef(cell) {
        if (cell) {
            this.storeBit(1);
            this.storeRef(cell);
        }
        else {
            this.storeBit(0);
        }
        return this;
    }
    /**
     * Store slice it in this builder
     * @param src source slice
     */
    storeSlice(src) {
        let c = src.clone();
        if (c.remainingBits > 0) {
            this.storeBits(c.loadBits(c.remainingBits));
        }
        while (c.remainingRefs > 0) {
            this.storeRef(c.loadRef());
        }
        return this;
    }
    /**
     * Store slice in this builder if not null
     * @param src source slice
     */
    storeMaybeSlice(src) {
        if (src) {
            this.storeBit(1);
            this.storeSlice(src);
        }
        else {
            this.storeBit(0);
        }
        return this;
    }
    /**
     * Store builder
     * @param src builder to store
     * @returns this builder
     */
    storeBuilder(src) {
        return this.storeSlice(src.endCell().beginParse());
    }
    /**
     * Store builder if not null
     * @param src builder to store
     * @returns this builder
     */
    storeMaybeBuilder(src) {
        if (src) {
            this.storeBit(1);
            this.storeBuilder(src);
        }
        else {
            this.storeBit(0);
        }
        return this;
    }
    /**
     * Store writer or builder
     * @param writer writer or builder to store
     * @returns this builder
     */
    storeWritable(writer) {
        if (typeof writer === 'object') {
            writer.writeTo(this);
        }
        else {
            writer(this);
        }
        return this;
    }
    /**
     * Store writer or builder if not null
     * @param writer writer or builder to store
     * @returns this builder
     */
    storeMaybeWritable(writer) {
        if (writer) {
            this.storeBit(1);
            this.storeWritable(writer);
        }
        else {
            this.storeBit(0);
        }
        return this;
    }
    /**
     * Store object in this builder
     * @param writer Writable or writer functuin
     */
    store(writer) {
        this.storeWritable(writer);
        return this;
    }
    /**
     * Store string tail
     * @param src source string
     * @returns this builder
     */
    storeStringTail(src) {
        (0, strings_1.writeString)(src, this);
        return this;
    }
    /**
     * Store string tail
     * @param src source string
     * @returns this builder
     */
    storeMaybeStringTail(src) {
        if (src !== null && src !== undefined) {
            this.storeBit(1);
            (0, strings_1.writeString)(src, this);
        }
        else {
            this.storeBit(0);
        }
        return this;
    }
    /**
     * Store string tail in ref
     * @param src source string
     * @returns this builder
     */
    storeStringRefTail(src) {
        this.storeRef(beginCell()
            .storeStringTail(src));
        return this;
    }
    /**
     * Store maybe string tail in ref
     * @param src source string
     * @returns this builder
     */
    storeMaybeStringRefTail(src) {
        if (src !== null && src !== undefined) {
            this.storeBit(1);
            this.storeStringRefTail(src);
        }
        else {
            this.storeBit(0);
        }
        return this;
    }
    /**
     * Store dictionary in this builder
     * @param dict dictionary to store
     * @returns this builder
     */
    storeDict(dict, key, value) {
        if (dict) {
            dict.store(this, key, value);
        }
        else {
            this.storeBit(0);
        }
        return this;
    }
    /**
     * Store dictionary in this builder directly
     * @param dict dictionary to store
     * @returns this builder
     */
    storeDictDirect(dict, key, value) {
        dict.storeDirect(this, key, value);
        return this;
    }
    /**
     * Complete cell
     * @param opts options
     * @returns cell
     */
    endCell(opts) {
        return new Cell_1.Cell({
            bits: this._bits.build(),
            refs: this._refs,
            exotic: opts?.exotic
        });
    }
    /**
     * Convert to cell
     * @returns cell
     */
    asCell() {
        return this.endCell();
    }
    /**
     * Convert to slice
     * @returns slice
     */
    asSlice() {
        return this.endCell().beginParse();
    }
}
exports.Builder = Builder;
