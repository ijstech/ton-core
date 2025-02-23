/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/// <reference types="node" />
/**
 * BitString is a class that represents a bitstring in a buffer with a specified offset and length
 */
export declare class BitString {
    static readonly EMPTY: BitString;
    private readonly _offset;
    private readonly _length;
    private readonly _data;
    /**
     * Checks if supplied object is BitString
     * @param src is unknow object
     * @returns true if object is BitString and false otherwise
     **/
    static isBitString(src: unknown): src is BitString;
    /**
     * Constructing BitString from a buffer
     * @param data data that contains the bitstring data. NOTE: We are expecting this buffer to be NOT modified
     * @param offset offset in bits from the start of the buffer
     * @param length length of the bitstring in bits
     */
    constructor(data: Buffer, offset: number, length: number);
    /**
     * Returns the length of the bitstring
     */
    get length(): number;
    /**
     * Returns the bit at the specified index
     * @param index index of the bit
     * @throws Error if index is out of bounds
     * @returns true if the bit is set, false otherwise
     */
    at(index: number): boolean;
    /**
     * Get a subscring of the bitstring
     * @param offset
     * @param length
     * @returns
     */
    substring(offset: number, length: number): BitString;
    /**
     * Try to get a buffer from the bitstring without allocations
     * @param offset offset in bits
     * @param length length in bits
     * @returns buffer if the bitstring is aligned to bytes, null otherwise
     */
    subbuffer(offset: number, length: number): Buffer | null;
    /**
     * Checks for equality
     * @param b other bitstring
     * @returns true if the bitstrings are equal, false otherwise
     */
    equals(b: BitString): boolean;
    /**
     * Format to canonical string
     * @returns formatted bits as a string
     */
    toString(): string;
}
