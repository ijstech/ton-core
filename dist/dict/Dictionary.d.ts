/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/// <reference types="node" />
import { Address } from "../address/Address";
import { Builder } from "../boc/Builder";
import { Cell } from "../boc/Cell";
import { Slice } from "../boc/Slice";
import { BitString } from "../boc/BitString";
import { Maybe } from "../utils/maybe";
export declare type DictionaryKeyTypes = Address | number | bigint | Buffer | BitString;
export declare type DictionaryKey<K extends DictionaryKeyTypes> = {
    bits: number;
    serialize(src: K): bigint;
    parse(src: bigint): K;
};
export declare type DictionaryValue<V> = {
    serialize(src: V, builder: Builder): void;
    parse(src: Slice): V;
};
export declare class Dictionary<K extends DictionaryKeyTypes, V> {
    static Keys: {
        /**
         * Standard address key
         * @returns DictionaryKey<Address>
         */
        Address: () => DictionaryKey<Address>;
        /**
         * Create standard big integer key
         * @param bits number of bits
         * @returns DictionaryKey<bigint>
         */
        BigInt: (bits: number) => DictionaryKey<bigint>;
        /**
         * Create integer key
         * @param bits bits of integer
         * @returns DictionaryKey<number>
         */
        Int: (bits: number) => DictionaryKey<number>;
        /**
         * Create standard unsigned big integer key
         * @param bits number of bits
         * @returns DictionaryKey<bigint>
         */
        BigUint: (bits: number) => DictionaryKey<bigint>;
        /**
         * Create standard unsigned integer key
         * @param bits number of bits
         * @returns DictionaryKey<number>
         */
        Uint: (bits: number) => DictionaryKey<number>;
        /**
         * Create standard buffer key
         * @param bytes number of bytes of a buffer
         * @returns DictionaryKey<Buffer>
         */
        Buffer: (bytes: number) => DictionaryKey<Buffer>;
        /**
         * Create BitString key
         * @param bits key length
         * @returns DictionaryKey<BitString>
         * Point is that Buffer has to be 8 bit aligned,
         * while key is TVM dictionary doesn't have to be
         * aligned at all.
         */
        BitString: (bits: number) => DictionaryKey<BitString>;
    };
    static Values: {
        /**
         * Create standard integer value
         * @returns DictionaryValue<bigint>
         */
        BigInt: (bits: number) => DictionaryValue<bigint>;
        /**
         * Create standard integer value
         * @returns DictionaryValue<number>
         */
        Int: (bits: number) => DictionaryValue<number>;
        /**
         * Create big var int
         * @param bits nubmer of header bits
         * @returns DictionaryValue<bigint>
         */
        BigVarInt: (bits: number) => DictionaryValue<bigint>;
        /**
         * Create standard unsigned integer value
         * @param bits number of bits
         * @returns DictionaryValue<bigint>
         */
        BigUint: (bits: number) => DictionaryValue<bigint>;
        /**
         * Create standard unsigned integer value
         * @param bits number of bits
         * @returns DictionaryValue<bigint>
         */
        Uint: (bits: number) => DictionaryValue<number>;
        /**
         * Create big var int
         * @param bits nubmer of header bits
         * @returns DictionaryValue<bigint>
         */
        BigVarUint: (bits: number) => DictionaryValue<bigint>;
        /**
         * Create standard boolean value
         * @returns DictionaryValue<boolean>
         */
        Bool: () => DictionaryValue<boolean>;
        /**
         * Create standard address value
         * @returns DictionaryValue<Address>
         */
        Address: () => DictionaryValue<Address>;
        /**
         * Create standard cell value
         * @returns DictionaryValue<Cell>
         */
        Cell: () => DictionaryValue<Cell>;
        /**
         * Create Builder value
         * @param bytes number of bytes of a buffer
         * @returns DictionaryValue<Builder>
         */
        Buffer: (bytes: number) => DictionaryValue<Buffer>;
        /**
         * Create BitString value
         * @param requested bit length
         * @returns DictionaryValue<BitString>
         * Point is that Buffer is not applicable
         * when length is not 8 bit alligned.
         */
        BitString: (bits: number) => DictionaryValue<BitString>;
        /**
         * Create dictionary value
         * @param key
         * @param value
         */
        Dictionary: <K_1 extends DictionaryKeyTypes, V_1>(key: DictionaryKey<K_1>, value: DictionaryValue<V_1>) => DictionaryValue<Dictionary<K_1, V_1>>;
    };
    /**
     * Create an empty map
     * @param key key type
     * @param value value type
     * @returns Dictionary<K, V>
     */
    static empty<K extends DictionaryKeyTypes, V>(key?: Maybe<DictionaryKey<K>>, value?: Maybe<DictionaryValue<V>>): Dictionary<K, V>;
    /**
     * Load dictionary from slice
     * @param key key description
     * @param value value description
     * @param src slice
     * @returns Dictionary<K, V>
     */
    static load<K extends DictionaryKeyTypes, V>(key: DictionaryKey<K>, value: DictionaryValue<V>, sc: Slice | Cell): Dictionary<K, V>;
    /**
     * Low level method for rare dictionaries from system contracts.
     * Loads dictionary from slice directly without going to the ref.
     *
     * @param key key description
     * @param value value description
     * @param sc slice
     * @returns Dictionary<K, V>
     */
    static loadDirect<K extends DictionaryKeyTypes, V>(key: DictionaryKey<K>, value: DictionaryValue<V>, sc: Slice | Cell | null): Dictionary<K, V>;
    private readonly _key;
    private readonly _value;
    private readonly _map;
    private constructor();
    get size(): number;
    get(key: K): V | undefined;
    has(key: K): boolean;
    set(key: K, value: V): this;
    delete(key: K): boolean;
    clear(): void;
    [Symbol.iterator](): IterableIterator<[K, V]>;
    keys(): K[];
    values(): V[];
    store(builder: Builder, key?: Maybe<DictionaryKey<K>>, value?: Maybe<DictionaryValue<V>>): void;
    storeDirect(builder: Builder, key?: Maybe<DictionaryKey<K>>, value?: Maybe<DictionaryValue<V>>): void;
    /**
     * Generate merkle proof for multiple keys in the dictionary
     * @param keys an array of the keys
     * @returns generated merkle proof cell
     */
    generateMerkleProof(keys: K[]): Cell;
    /**
     * Low level method for generating pruned dictionary directly.
     * The result can be used as a part of a bigger merkle proof
     * @param keys an array of the keys
     * @returns cell that contains the pruned dictionary
     */
    generateMerkleProofDirect(keys: K[]): Cell;
    generateMerkleUpdate(key: K, newValue: V): Cell;
}
