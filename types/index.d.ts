
declare module "utils/crc16" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    export function crc16(data: Buffer): Buffer;
}
declare module "address/Address" {
    export class Address {
        static isAddress(src: any): src is Address;
        static isFriendly(source: string): boolean;
        static isRaw(source: string): boolean;
        static normalize(source: string | Address): string;
        static parse(source: string): Address;
        static parseRaw(source: string): Address;
        static parseFriendly(source: string | Buffer): {
            isBounceable: boolean;
            isTestOnly: boolean;
            address: Address;
        };
        readonly workChain: number;
        readonly hash: Buffer;
        constructor(workChain: number, hash: Buffer);
        toRawString: () => string;
        equals(src: Address): boolean;
        toRaw: () => Buffer;
        toStringBuffer: (args?: {
            bounceable?: boolean;
            testOnly?: boolean;
        }) => Buffer;
        toString: (args?: {
            urlSafe?: boolean;
            bounceable?: boolean;
            testOnly?: boolean;
        }) => string;
    }
    export function address(src: string): Address;
}
declare module "address/ExternalAddress" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    export class ExternalAddress {
        static isAddress(src: any): src is ExternalAddress;
        readonly value: bigint;
        readonly bits: number;
        constructor(value: bigint, bits: number);
        toString(): string;
    }
}
declare module "utils/base32" {
    export function base32Encode(buffer: Buffer): string;
    export function base32Decode(input: string): Buffer;
}
declare module "address/ADNLAddress" {
    export class ADNLAddress {
        static parseFriendly(src: string): ADNLAddress;
        static parseRaw(src: string): ADNLAddress;
        readonly address: Buffer;
        constructor(address: Buffer);
        equals(b: ADNLAddress): boolean;
        toRaw: () => string;
        toString: () => string;
    }
}
declare module "utils/bitsForNumber" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    export function bitsForNumber(src: bigint | number, mode: 'int' | 'uint'): number;
}
declare module "utils/maybe" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    export type Maybe<T> = T | null | undefined;
}
declare module "boc/utils/paddedBits" {
    import { BitString } from "boc/BitString";
    export function bitsToPaddedBuffer(bits: BitString): Buffer;
    export function paddedBufferToBits(buff: Buffer): BitString;
}
declare module "boc/BitString" {
    /**
     * BitString is a class that represents a bitstring in a buffer with a specified offset and length
     */
    export class BitString {
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
}
declare module "boc/BitBuilder" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Address } from "address/Address";
    import { ExternalAddress } from "address/ExternalAddress";
    import { Maybe } from "utils/maybe";
    import { BitString } from "boc/BitString";
    /**
     * Class for building bit strings
     */
    export class BitBuilder {
        private _buffer;
        private _length;
        constructor(size?: number);
        /**
         * Current number of bits written
         */
        get length(): number;
        /**
         * Write a single bit
         * @param value bit to write, true or positive number for 1, false or zero or negative for 0
         */
        writeBit(value: boolean | number): void;
        /**
         * Copy bits from BitString
         * @param src source bits
         */
        writeBits(src: BitString): void;
        /**
         * Write bits from buffer
         * @param src source buffer
         */
        writeBuffer(src: Buffer): void;
        /**
         * Write uint value
         * @param value value as bigint or number
         * @param bits number of bits to write
         */
        writeUint(value: bigint | number, bits: number): void;
        /**
         * Write int value
         * @param value value as bigint or number
         * @param bits number of bits to write
         */
        writeInt(value: bigint | number, bits: number): void;
        /**
         * Wrtie var uint value, used for serializing coins
         * @param value value to write as bigint or number
         * @param bits header bits to write size
         */
        writeVarUint(value: number | bigint, bits: number): void;
        /**
         * Wrtie var int value, used for serializing coins
         * @param value value to write as bigint or number
         * @param bits header bits to write size
         */
        writeVarInt(value: number | bigint, bits: number): void;
        /**
         * Write coins in var uint format
         * @param amount amount to write
         */
        writeCoins(amount: number | bigint): void;
        /**
         * Write address
         * @param address write address or address external
         */
        writeAddress(address: Maybe<Address | ExternalAddress>): void;
        /**
         * Build BitString
         * @returns result bit string
         */
        build(): BitString;
        /**
         * Build into Buffer
         * @returns result buffer
         */
        buffer(): Buffer;
    }
}
declare module "boc/Writable" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Builder } from "boc/Builder";
    export type Writable = {
        writeTo: (builder: Builder) => void;
    };
}
declare module "boc/CellType" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    export enum CellType {
        Ordinary = -1,
        PrunedBranch = 1,
        Library = 2,
        MerkleProof = 3,
        MerkleUpdate = 4
    }
}
declare module "dict/utils/readUnaryLength" {
    import { Slice } from "boc/Slice";
    export function readUnaryLength(slice: Slice): number;
}
declare module "boc/BitReader" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Address } from "address/Address";
    import { ExternalAddress } from "address/ExternalAddress";
    import { BitString } from "boc/BitString";
    /**
     * Class for reading bit strings
     */
    export class BitReader {
        private _bits;
        private _offset;
        private _checkpoints;
        constructor(bits: BitString, offset?: number);
        /**
         * Offset in source bit string
         */
        get offset(): number;
        /**
         * Number of bits remaining
         */
        get remaining(): number;
        /**
         * Skip bits
         * @param bits number of bits to skip
         */
        skip(bits: number): void;
        /**
         * Reset to the beginning or latest checkpoint
         */
        reset(): void;
        /**
         * Save checkpoint
         */
        save(): void;
        /**
         * Load a single bit
         * @returns true if the bit is set, false otherwise
         */
        loadBit(): boolean;
        /**
         * Preload bit
         * @returns true if the bit is set, false otherwise
         */
        preloadBit(): boolean;
        /**
         * Load bit string
         * @param bits number of bits to read
         * @returns new bitstring
         */
        loadBits(bits: number): BitString;
        /**
         * Preload bit string
         * @param bits number of bits to read
         * @returns new bitstring
         */
        preloadBits(bits: number): BitString;
        /**
         * Load buffer
         * @param bytes number of bytes
         * @returns new buffer
         */
        loadBuffer(bytes: number): Buffer;
        /**
         * Preload buffer
         * @param bytes number of bytes
         * @returns new buffer
         */
        preloadBuffer(bytes: number): Buffer;
        /**
         * Load uint value
         * @param bits uint bits
         * @returns read value as number
         */
        loadUint(bits: number): number;
        /**
         * Load uint value as bigint
         * @param bits uint bits
         * @returns read value as bigint
         */
        loadUintBig(bits: number): bigint;
        /**
         * Preload uint value
         * @param bits uint bits
         * @returns read value as number
         */
        preloadUint(bits: number): number;
        /**
         * Preload uint value as bigint
         * @param bits uint bits
         * @returns read value as bigint
         */
        preloadUintBig(bits: number): bigint;
        /**
         * Load int value
         * @param bits int bits
         * @returns read value as bigint
         */
        loadInt(bits: number): number;
        /**
         * Load int value as bigint
         * @param bits int bits
         * @returns read value as bigint
         */
        loadIntBig(bits: number): bigint;
        /**
         * Preload int value
         * @param bits int bits
         * @returns read value as bigint
         */
        preloadInt(bits: number): number;
        /**
         * Preload int value
         * @param bits int bits
         * @returns read value as bigint
         */
        preloadIntBig(bits: number): bigint;
        /**
         * Load varuint value
         * @param bits number of bits to read the size
         * @returns read value as bigint
         */
        loadVarUint(bits: number): number;
        /**
         * Load varuint value
         * @param bits number of bits to read the size
         * @returns read value as bigint
         */
        loadVarUintBig(bits: number): bigint;
        /**
         * Preload varuint value
         * @param bits number of bits to read the size
         * @returns read value as bigint
         */
        preloadVarUint(bits: number): number;
        /**
         * Preload varuint value
         * @param bits number of bits to read the size
         * @returns read value as bigint
         */
        preloadVarUintBig(bits: number): bigint;
        /**
         * Load varint value
         * @param bits number of bits to read the size
         * @returns read value as bigint
         */
        loadVarInt(bits: number): number;
        /**
         * Load varint value
         * @param bits number of bits to read the size
         * @returns read value as bigint
         */
        loadVarIntBig(bits: number): bigint;
        /**
         * Preload varint value
         * @param bits number of bits to read the size
         * @returns read value as bigint
         */
        preloadVarInt(bits: number): number;
        /**
         * Preload varint value
         * @param bits number of bits to read the size
         * @returns read value as bigint
         */
        preloadVarIntBig(bits: number): bigint;
        /**
         * Load coins value
         * @returns read value as bigint
         */
        loadCoins(): bigint;
        /**
         * Preload coins value
         * @returns read value as bigint
         */
        preloadCoins(): bigint;
        /**
         * Load Address
         * @returns Address
         */
        loadAddress(): Address;
        /**
         * Load internal address
         * @returns Address or null
         */
        loadMaybeAddress(): Address | null;
        /**
         * Load external address
         * @returns ExternalAddress
         */
        loadExternalAddress(): ExternalAddress;
        /**
         * Load external address
         * @returns ExternalAddress or null
         */
        loadMaybeExternalAddress(): ExternalAddress | null;
        /**
         * Read address of any type
         * @returns Address or ExternalAddress or null
         */
        loadAddressAny(): Address | ExternalAddress | null;
        /**
         * Load bit string that was padded to make it byte alligned. Used in BOC serialization
         * @param bytes number of bytes to read
         */
        loadPaddedBits(bits: number): BitString;
        /**
         * Clone BitReader
         */
        clone(): BitReader;
        /**
         * Preload int from specific offset
         * @param bits bits to preload
         * @param offset offset to start from
         * @returns read value as bigint
         */
        private _preloadInt;
        /**
         * Preload uint from specific offset
         * @param bits bits to preload
         * @param offset offset to start from
         * @returns read value as bigint
         */
        private _preloadUint;
        private _preloadBuffer;
        private _loadInternalAddress;
        private _loadExternalAddress;
        private _toSafeInteger;
    }
}
declare module "boc/cell/exoticMerkleProof" {
    import { BitString } from "boc/BitString";
    import { Cell } from "boc/Cell";
    export function exoticMerkleProof(bits: BitString, refs: Cell[]): {
        proofDepth: number;
        proofHash: Buffer;
    };
    export function convertToMerkleProof(c: Cell): Cell;
}
declare module "dict/generateMerkleProof" {
    import { Cell } from "boc/Cell";
    import { DictionaryKeyTypes, Dictionary, DictionaryKey } from "dict/Dictionary";
    export function generateMerkleProofDirect<K extends DictionaryKeyTypes, V>(dict: Dictionary<K, V>, keys: K[], keyObject: DictionaryKey<K>): Cell;
    export function generateMerkleProof<K extends DictionaryKeyTypes, V>(dict: Dictionary<K, V>, keys: K[], keyObject: DictionaryKey<K>): Cell;
}
declare module "dict/generateMerkleUpdate" {
    import { Cell } from "boc/Cell";
    import { DictionaryKeyTypes, Dictionary, DictionaryKey } from "dict/Dictionary";
    export function generateMerkleUpdate<K extends DictionaryKeyTypes, V>(dict: Dictionary<K, V>, key: K, keyObject: DictionaryKey<K>, newValue: V): Cell;
}
declare module "dict/parseDict" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Slice } from "boc/Slice";
    export function parseDict<V>(sc: Slice | null, keySize: number, extractor: (src: Slice) => V): Map<bigint, V>;
}
declare module "dict/utils/findCommonPrefix" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    export function findCommonPrefix(src: string[], startPos?: number): string;
}
declare module "dict/serializeDict" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Builder } from "boc/Builder";
    type Node<T> = {
        type: 'fork';
        left: Edge<T>;
        right: Edge<T>;
    } | {
        type: 'leaf';
        value: T;
    };
    type Edge<T> = {
        label: string;
        node: Node<T>;
    };
    export function buildTree<T>(src: Map<bigint, T>, keyLength: number): Edge<T>;
    export function writeLabelShort(src: string, to: Builder): Builder;
    export function writeLabelLong(src: string, keyLength: number, to: Builder): Builder;
    export function writeLabelSame(value: number | boolean, length: number, keyLength: number, to: Builder): void;
    export function detectLabelType(src: string, keyLength: number): "short" | "long" | "same";
    export function serializeDict<T>(src: Map<bigint, T>, keyLength: number, serializer: (src: T, cell: Builder) => void, to: Builder): void;
}
declare module "dict/utils/internalKeySerializer" {
    export function serializeInternalKey(value: any): string;
    export function deserializeInternalKey(value: string): any;
}
declare module "dict/Dictionary" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Address } from "address/Address";
    import { Builder } from "boc/Builder";
    import { Cell } from "boc/Cell";
    import { Slice } from "boc/Slice";
    import { BitString } from "boc/BitString";
    import { Maybe } from "utils/maybe";
    export type DictionaryKeyTypes = Address | number | bigint | Buffer | BitString;
    export type DictionaryKey<K extends DictionaryKeyTypes> = {
        bits: number;
        serialize(src: K): bigint;
        parse(src: bigint): K;
    };
    export type DictionaryValue<V> = {
        serialize(src: V, builder: Builder): void;
        parse(src: Slice): V;
    };
    export class Dictionary<K extends DictionaryKeyTypes, V> {
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
}
declare module "boc/utils/strings" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Builder } from "boc/Builder";
    import { Cell } from "boc/Cell";
    import { Slice } from "boc/Slice";
    export function readString(slice: Slice): string;
    export function stringToCell(src: string): Cell;
    export function writeString(src: string, builder: Builder): void;
}
declare module "boc/Slice" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Dictionary, DictionaryKey, DictionaryKeyTypes, DictionaryValue } from "dict/Dictionary";
    import { BitReader } from "boc/BitReader";
    import { Cell } from "boc/Cell";
    /**
     * Slice is a class that allows to read cell data
     */
    export class Slice {
        private _reader;
        private _refs;
        private _refsOffset;
        constructor(reader: BitReader, refs: Cell[]);
        /**
         * Get remaining bits
         */
        get remainingBits(): number;
        /**
         * Get offset bits
         */
        get offsetBits(): number;
        /**
         * Get remaining refs
         */
        get remainingRefs(): number;
        /**
         * Get offset refs
         */
        get offsetRefs(): number;
        /**
         * Skip bits
         * @param bits
         */
        skip(bits: number): this;
        /**
         * Load a single bit
         * @returns true or false depending on the bit value
         */
        loadBit(): boolean;
        /**
         * Preload a signle bit
         * @returns true or false depending on the bit value
         */
        preloadBit(): boolean;
        /**
         * Load a boolean
         * @returns true or false depending on the bit value
         */
        loadBoolean(): boolean;
        /**
         * Load maybe boolean
         * @returns true or false depending on the bit value or null
         */
        loadMaybeBoolean(): boolean | null;
        /**
         * Load bits as a new BitString
         * @param bits number of bits to read
         * @returns new BitString
         */
        loadBits(bits: number): import("boc/BitString").BitString;
        /**
         * Preload bits as a new BitString
         * @param bits number of bits to read
         * @returns new BitString
         */
        preloadBits(bits: number): import("boc/BitString").BitString;
        /**
         * Load uint
         * @param bits number of bits to read
         * @returns uint value
         */
        loadUint(bits: number): number;
        /**
         * Load uint
         * @param bits number of bits to read
         * @returns uint value
         */
        loadUintBig(bits: number): bigint;
        /**
         * Preload uint
         * @param bits number of bits to read
         * @returns uint value
         */
        preloadUint(bits: number): number;
        /**
         * Preload uint
         * @param bits number of bits to read
         * @returns uint value
         */
        preloadUintBig(bits: number): bigint;
        /**
         * Load maybe uint
         * @param bits number of bits to read
         * @returns uint value or null
         */
        loadMaybeUint(bits: number): number | null;
        /**
         * Load maybe uint
         * @param bits number of bits to read
         * @returns uint value or null
         */
        loadMaybeUintBig(bits: number): bigint | null;
        /**
         * Load int
         * @param bits number of bits to read
         * @returns int value
         */
        loadInt(bits: number): number;
        /**
         * Load int
         * @param bits number of bits to read
         * @returns int value
         */
        loadIntBig(bits: number): bigint;
        /**
         * Preload int
         * @param bits number of bits to read
         * @returns int value
         */
        preloadInt(bits: number): number;
        /**
         * Preload int
         * @param bits number of bits to read
         * @returns int value
         */
        preloadIntBig(bits: number): bigint;
        /**
         * Load maybe uint
         * @param bits number of bits to read
         * @returns uint value or null
         */
        loadMaybeInt(bits: number): number | null;
        /**
         * Load maybe uint
         * @param bits number of bits to read
         * @returns uint value or null
         */
        loadMaybeIntBig(bits: number): bigint | null;
        /**
         * Load varuint
         * @param bits number of bits to read in header
         * @returns varuint value
         */
        loadVarUint(bits: number): number;
        /**
         * Load varuint
         * @param bits number of bits to read in header
         * @returns varuint value
         */
        loadVarUintBig(bits: number): bigint;
        /**
         * Preload varuint
         * @param bits number of bits to read in header
         * @returns varuint value
         */
        preloadVarUint(bits: number): number;
        /**
         * Preload varuint
         * @param bits number of bits to read in header
         * @returns varuint value
         */
        preloadVarUintBig(bits: number): bigint;
        /**
         * Load varint
         * @param bits number of bits to read in header
         * @returns varint value
         */
        loadVarInt(bits: number): number;
        /**
         * Load varint
         * @param bits number of bits to read in header
         * @returns varint value
         */
        loadVarIntBig(bits: number): bigint;
        /**
         * Preload varint
         * @param bits number of bits to read in header
         * @returns varint value
         */
        preloadVarInt(bits: number): number;
        /**
         * Preload varint
         * @param bits number of bits to read in header
         * @returns varint value
         */
        preloadVarIntBig(bits: number): bigint;
        /**
         * Load coins
         * @returns coins value
         */
        loadCoins(): bigint;
        /**
         * Preload coins
         * @returns coins value
         */
        preloadCoins(): bigint;
        /**
         * Load maybe coins
         * @returns coins value or null
         */
        loadMaybeCoins(): bigint | null;
        /**
         * Load internal Address
         * @returns Address
         */
        loadAddress(): import("address/Address").Address;
        /**
         * Load optional internal Address
         * @returns Address or null
         */
        loadMaybeAddress(): import("address/Address").Address | null;
        /**
         * Load external address
         * @returns ExternalAddress
         */
        loadExternalAddress(): import("address/ExternalAddress").ExternalAddress;
        /**
         * Load optional external address
         * @returns ExternalAddress or null
         */
        loadMaybeExternalAddress(): import("address/ExternalAddress").ExternalAddress | null;
        /**
         * Load address
         * @returns Address, ExternalAddress or null
         */
        loadAddressAny(): import("address/Address").Address | import("address/ExternalAddress").ExternalAddress | null;
        /**
         * Load reference
         * @returns Cell
         */
        loadRef(): Cell;
        /**
         * Preload reference
         * @returns Cell
         */
        preloadRef(): Cell;
        /**
         * Load optional reference
         * @returns Cell or null
         */
        loadMaybeRef(): Cell | null;
        /**
         * Preload optional reference
         * @returns Cell or null
         */
        preloadMaybeRef(): Cell | null;
        /**
         * Load byte buffer
         * @param bytes number of bytes to load
         * @returns Buffer
         */
        loadBuffer(bytes: number): Buffer;
        /**
         * Load byte buffer
         * @param bytes number of bytes to load
         * @returns Buffer
         */
        preloadBuffer(bytes: number): Buffer;
        /**
         * Load string tail
         */
        loadStringTail(): string;
        /**
         * Load maybe string tail
         * @returns string or null
         */
        loadMaybeStringTail(): string | null;
        /**
         * Load string tail from ref
         * @returns string
         */
        loadStringRefTail(): string;
        /**
         * Load maybe string tail from ref
         * @returns string or null
         */
        loadMaybeStringRefTail(): string | null;
        /**
         * Loads dictionary
         * @param key key description
         * @param value value description
         * @returns Dictionary<K, V>
         */
        loadDict<K extends DictionaryKeyTypes, V>(key: DictionaryKey<K>, value: DictionaryValue<V>): Dictionary<K, V>;
        /**
         * Loads dictionary directly from current slice
         * @param key key description
         * @param value value description
         * @returns Dictionary<K, V>
         */
        loadDictDirect<K extends DictionaryKeyTypes, V>(key: DictionaryKey<K>, value: DictionaryValue<V>): Dictionary<K, V>;
        /**
         * Checks if slice is empty
         */
        endParse(): void;
        /**
         * Convert slice to cell
         */
        asCell(): Cell;
        /**
         *
         * @returns
         */
        asBuilder(): import("boc/Builder").Builder;
        /**
         * Clone slice
         * @returns cloned slice
         */
        clone(fromStart?: boolean): Slice;
        /**
         * Print slice as string by converting it to cell
         * @returns string
         */
        toString(): string;
    }
}
declare module "boc/cell/LevelMask" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    export class LevelMask {
        private _mask;
        private _hashIndex;
        private _hashCount;
        constructor(mask?: number);
        get value(): number;
        get level(): number;
        get hashIndex(): number;
        get hashCount(): number;
        apply(level: number): LevelMask;
        isSignificant(level: number): boolean;
    }
}
declare module "boc/cell/exoticLibrary" {
    import { BitString } from "boc/BitString";
    import { Cell } from "boc/Cell";
    export function exoticLibrary(bits: BitString, refs: Cell[]): {};
}
declare module "boc/cell/exoticMerkleUpdate" {
    import { BitString } from "boc/BitString";
    import { Cell } from "boc/Cell";
    export function exoticMerkleUpdate(bits: BitString, refs: Cell[]): {
        proofDepth1: number;
        proofDepth2: number;
        proofHash1: Buffer;
        proofHash2: Buffer;
    };
}
declare module "boc/cell/exoticPruned" {
    import { BitString } from "boc/BitString";
    import { Cell } from "boc/Cell";
    export type ExoticPruned = {
        mask: number;
        pruned: {
            depth: number;
            hash: Buffer;
        }[];
    };
    export function exoticPruned(bits: BitString, refs: Cell[]): ExoticPruned;
}
declare module "boc/cell/resolveExotic" {
    import { BitString } from "boc/BitString";
    import { Cell } from "boc/Cell";
    import { CellType } from "boc/CellType";
    import { LevelMask } from "boc/cell/LevelMask";
    export function resolveExotic(bits: BitString, refs: Cell[]): {
        type: CellType;
        depths: number[];
        hashes: Buffer[];
        mask: LevelMask;
    };
}
declare module "boc/cell/descriptor" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { BitString } from "boc/BitString";
    import { Cell } from "boc/Cell";
    import { CellType } from "boc/CellType";
    export function getRefsDescriptor(refs: Cell[], levelMask: number, type: CellType): number;
    export function getBitsDescriptor(bits: BitString): number;
    export function getRepr(originalBits: BitString, bits: BitString, refs: Cell[], level: number, levelMask: number, type: CellType): Buffer;
}
declare module "boc/cell/wonderCalculator" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { BitString } from "boc/BitString";
    import { CellType } from "boc/CellType";
    import { Cell } from "boc/Cell";
    import { LevelMask } from "boc/cell/LevelMask";
    export function wonderCalculator(type: CellType, bits: BitString, refs: Cell[]): {
        mask: LevelMask;
        hashes: Buffer[];
        depths: number[];
    };
}
declare module "boc/cell/utils/topologicalSort" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Cell } from "boc/Cell";
    export function topologicalSort(src: Cell): {
        cell: Cell;
        refs: number[];
    }[];
}
declare module "utils/crc32c" {
    export function crc32c(source: Buffer): Buffer;
}
declare module "boc/cell/serialization" {
    import { Cell } from "boc/Cell";
    export function parseBoc(src: Buffer): {
        size: number;
        offBytes: number;
        cells: number;
        roots: number;
        absent: number;
        totalCellSize: number;
        index: Buffer | null;
        cellData: Buffer;
        root: number[];
    };
    export function deserializeBoc(src: Buffer): Cell[];
    export function serializeBoc(root: Cell, opts: {
        idx: boolean;
        crc32: boolean;
    }): Buffer;
}
declare module "boc/Cell" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { BitString } from "boc/BitString";
    import { CellType } from "boc/CellType";
    import { Slice } from "boc/Slice";
    import { LevelMask } from "boc/cell/LevelMask";
    /**
     * Cell as described in TVM spec
     */
    export class Cell {
        static readonly EMPTY: Cell;
        /**
         * Deserialize cells from BOC
         * @param src source buffer
         * @returns array of cells
         */
        static fromBoc(src: Buffer): Cell[];
        /**
         * Helper function that deserializes a single cell from BOC in base64
         * @param src source string
         */
        static fromBase64(src: string): Cell;
        /**
         * Helper function that deserializes a single cell from BOC in hex
         * @param src source string
         */
        static fromHex(src: string): Cell;
        readonly type: CellType;
        readonly bits: BitString;
        readonly refs: Cell[];
        readonly mask: LevelMask;
        private _hashes;
        private _depths;
        constructor(opts?: {
            exotic?: boolean;
            bits?: BitString;
            refs?: Cell[];
        });
        /**
         * Check if cell is exotic
         */
        get isExotic(): boolean;
        /**
         * Beging cell parsing
         * @returns a new slice
         */
        beginParse: (allowExotic?: boolean) => Slice;
        /**
         * Get cell hash
         * @param level level
         * @returns cell hash
         */
        hash: (level?: number) => Buffer;
        /**
         * Get cell depth
         * @param level level
         * @returns cell depth
         */
        depth: (level?: number) => number;
        /**
         * Get cell level
         * @returns cell level
         */
        level: () => number;
        /**
         * Checks cell to be euqal to another cell
         * @param other other cell
         * @returns true if cells are equal
         */
        equals: (other: Cell) => boolean;
        /**
         * Serializes cell to BOC
         * @param opts options
         */
        toBoc(opts?: {
            idx?: boolean | null | undefined;
            crc32?: boolean | null | undefined;
        }): Buffer;
        /**
         * Format cell to string
         * @param indent indentation
         * @returns string representation
         */
        toString(indent?: string): string;
        /**
         * Covnert cell to slice
         * @returns slice
         */
        asSlice(): Slice;
        /**
         * Convert cell to a builder that has this cell stored
         * @returns builder
         */
        asBuilder(): import("boc/Builder").Builder;
    }
    export { CellType };
}
declare module "boc/Builder" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Address } from "address/Address";
    import { ExternalAddress } from "address/ExternalAddress";
    import { BitString } from "boc/BitString";
    import { Writable } from "boc/Writable";
    import { Cell } from "boc/Cell";
    import { Slice } from "boc/Slice";
    import { Dictionary, DictionaryKey, DictionaryKeyTypes, DictionaryValue } from "dict/Dictionary";
    import { Maybe } from "utils/maybe";
    /**
     * Start building a cell
     * @returns a new builder
     */
    export function beginCell(): Builder;
    /**
     * Builder for Cells
     */
    export class Builder {
        private _bits;
        private _refs;
        constructor();
        /**
         * Bits written so far
         */
        get bits(): number;
        /**
         * References written so far
         */
        get refs(): number;
        /**
         * Available bits
         */
        get availableBits(): number;
        /**
         * Available references
         */
        get availableRefs(): number;
        /**
         * Write a single bit
         * @param value bit to write, true or positive number for 1, false or zero or negative for 0
         * @returns this builder
         */
        storeBit(value: boolean | number): this;
        /**
         * Write bits from BitString
         * @param src source bits
         * @returns this builder
         */
        storeBits(src: BitString): this;
        /**
         * Store Buffer
         * @param src source buffer
         * @param bytes optional number of bytes to write
         * @returns this builder
         */
        storeBuffer(src: Buffer, bytes?: Maybe<number>): this;
        /**
         * Store Maybe Buffer
         * @param src source buffer or null
         * @param bytes optional number of bytes to write
         * @returns this builder
         */
        storeMaybeBuffer(src: Buffer | null, bytes?: Maybe<number>): this;
        /**
         * Store uint value
         * @param value value as bigint or number
         * @param bits number of bits to write
         * @returns this builder
         */
        storeUint(value: bigint | number, bits: number): this;
        /**
         * Store maybe uint value
         * @param value value as bigint or number, null or undefined
         * @param bits number of bits to write
         * @returns this builder
         */
        storeMaybeUint(value: Maybe<number | bigint>, bits: number): this;
        /**
         * Store int value
         * @param value value as bigint or number
         * @param bits number of bits to write
         * @returns this builder
         */
        storeInt(value: bigint | number, bits: number): this;
        /**
         * Store maybe int value
         * @param value value as bigint or number, null or undefined
         * @param bits number of bits to write
         * @returns this builder
         */
        storeMaybeInt(value: Maybe<number | bigint>, bits: number): this;
        /**
         * Store varuint value
         * @param value value as bigint or number
         * @param bits number of bits to write to header
         * @returns this builder
         */
        storeVarUint(value: number | bigint, bits: number): this;
        /**
         * Store maybe varuint value
         * @param value value as bigint or number, null or undefined
         * @param bits number of bits to write to header
         * @returns this builder
         */
        storeMaybeVarUint(value: Maybe<number | bigint>, bits: number): this;
        /**
         * Store varint value
         * @param value value as bigint or number
         * @param bits number of bits to write to header
         * @returns this builder
         */
        storeVarInt(value: number | bigint, bits: number): this;
        /**
         * Store maybe varint value
         * @param value value as bigint or number, null or undefined
         * @param bits number of bits to write to header
         * @returns this builder
         */
        storeMaybeVarInt(value: Maybe<number | bigint>, bits: number): this;
        /**
         * Store coins value
         * @param amount amount of coins
         * @returns this builder
         */
        storeCoins(amount: number | bigint): this;
        /**
         * Store maybe coins value
         * @param amount amount of coins, null or undefined
         * @returns this builder
         */
        storeMaybeCoins(amount: Maybe<number | bigint>): this;
        /**
         * Store address
         * @param addres address to store
         * @returns this builder
         */
        storeAddress(address: Maybe<Address | ExternalAddress>): this;
        /**
         * Store reference
         * @param cell cell or builder to store
         * @returns this builder
         */
        storeRef(cell: Cell | Builder): this;
        /**
         * Store reference if not null
         * @param cell cell or builder to store
         * @returns this builder
         */
        storeMaybeRef(cell?: Maybe<Cell | Builder>): this;
        /**
         * Store slice it in this builder
         * @param src source slice
         */
        storeSlice(src: Slice): this;
        /**
         * Store slice in this builder if not null
         * @param src source slice
         */
        storeMaybeSlice(src?: Maybe<Slice>): this;
        /**
         * Store builder
         * @param src builder to store
         * @returns this builder
         */
        storeBuilder(src: Builder): this;
        /**
         * Store builder if not null
         * @param src builder to store
         * @returns this builder
         */
        storeMaybeBuilder(src?: Maybe<Builder>): this;
        /**
         * Store writer or builder
         * @param writer writer or builder to store
         * @returns this builder
         */
        storeWritable(writer: ((builder: Builder) => void) | Writable): this;
        /**
         * Store writer or builder if not null
         * @param writer writer or builder to store
         * @returns this builder
         */
        storeMaybeWritable(writer?: Maybe<((builder: Builder) => void) | Writable>): this;
        /**
         * Store object in this builder
         * @param writer Writable or writer functuin
         */
        store(writer: ((builder: Builder) => void) | Writable): this;
        /**
         * Store string tail
         * @param src source string
         * @returns this builder
         */
        storeStringTail(src: string): this;
        /**
         * Store string tail
         * @param src source string
         * @returns this builder
         */
        storeMaybeStringTail(src?: Maybe<string>): this;
        /**
         * Store string tail in ref
         * @param src source string
         * @returns this builder
         */
        storeStringRefTail(src: string): this;
        /**
         * Store maybe string tail in ref
         * @param src source string
         * @returns this builder
         */
        storeMaybeStringRefTail(src?: Maybe<string | null>): this;
        /**
         * Store dictionary in this builder
         * @param dict dictionary to store
         * @returns this builder
         */
        storeDict<K extends DictionaryKeyTypes, V>(dict?: Maybe<Dictionary<K, V>>, key?: Maybe<DictionaryKey<K>>, value?: Maybe<DictionaryValue<V>>): this;
        /**
         * Store dictionary in this builder directly
         * @param dict dictionary to store
         * @returns this builder
         */
        storeDictDirect<K extends DictionaryKeyTypes, V>(dict: Dictionary<K, V>, key?: Maybe<DictionaryKey<K>>, value?: Maybe<DictionaryValue<V>>): this;
        /**
         * Complete cell
         * @param opts options
         * @returns cell
         */
        endCell(opts?: {
            exotic?: boolean;
        }): Cell;
        /**
         * Convert to cell
         * @returns cell
         */
        asCell(): Cell;
        /**
         * Convert to slice
         * @returns slice
         */
        asSlice(): Slice;
    }
}
declare module "types/SimpleLibrary" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Builder } from "boc/Builder";
    import { Cell } from "boc/Cell";
    import { Slice } from "boc/Slice";
    import { DictionaryValue } from "dict/Dictionary";
    export interface SimpleLibrary {
        public: boolean;
        root: Cell;
    }
    export function loadSimpleLibrary(slice: Slice): SimpleLibrary;
    export function storeSimpleLibrary(src: SimpleLibrary): (builder: Builder) => void;
    export const SimpleLibraryValue: DictionaryValue<SimpleLibrary>;
}
declare module "types/TickTock" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Builder } from "boc/Builder";
    import { Slice } from "boc/Slice";
    export type TickTock = {
        tick: boolean;
        tock: boolean;
    };
    export function loadTickTock(slice: Slice): TickTock;
    export function storeTickTock(src: TickTock): (builder: Builder) => void;
}
declare module "types/StateInit" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Builder } from "boc/Builder";
    import { Cell } from "boc/Cell";
    import { Slice } from "boc/Slice";
    import { Dictionary } from "dict/Dictionary";
    import { Maybe } from "utils/maybe";
    import { SimpleLibrary } from "types/SimpleLibrary";
    import { TickTock } from "types/TickTock";
    export interface StateInit {
        splitDepth?: Maybe<number>;
        special?: Maybe<TickTock>;
        code?: Maybe<Cell>;
        data?: Maybe<Cell>;
        libraries?: Maybe<Dictionary<bigint, SimpleLibrary>>;
    }
    export function loadStateInit(slice: Slice): StateInit;
    export function storeStateInit(src: StateInit): (builder: Builder) => void;
}
declare module "address/contractAddress" {
    import { StateInit } from "types/StateInit";
    import { Address } from "address/Address";
    export function contractAddress(workchain: number, init: StateInit): Address;
}
declare module "tuple/tuple" {
    import { Cell } from "boc/Cell";
    export type Tuple = {
        type: 'tuple';
        items: TupleItem[];
    };
    export type TupleItemNull = {
        type: 'null';
    };
    export type TupleItemInt = {
        type: 'int';
        value: bigint;
    };
    export type TupleItemNaN = {
        type: 'nan';
    };
    export type TupleItemCell = {
        type: 'cell';
        cell: Cell;
    };
    export type TupleItemSlice = {
        type: 'slice';
        cell: Cell;
    };
    export type TupleItemBuilder = {
        type: 'builder';
        cell: Cell;
    };
    export type TupleItem = TupleItemNull | TupleItemInt | TupleItemNaN | TupleItemCell | TupleItemSlice | TupleItemBuilder | Tuple;
    export function serializeTuple(src: TupleItem[]): Cell;
    export function parseTuple(src: Cell): TupleItem[];
}
declare module "tuple/reader" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { TupleItem } from "tuple/tuple";
    export class TupleReader {
        private readonly items;
        constructor(items: TupleItem[]);
        get remaining(): number;
        peek(): TupleItem;
        pop(): TupleItem;
        skip(num?: number): this;
        readBigNumber(): bigint;
        readBigNumberOpt(): bigint | null;
        readNumber(): number;
        readNumberOpt(): number | null;
        readBoolean(): boolean;
        readBooleanOpt(): boolean | null;
        readAddress(): import("address/Address").Address;
        readAddressOpt(): import("address/Address").Address | null;
        readCell(): import("boc/Cell").Cell;
        readCellOpt(): import("boc/Cell").Cell | null;
        readTuple(): TupleReader;
        readTupleOpt(): TupleReader | null;
        private static readLispList;
        readLispListDirect(): TupleItem[];
        readLispList(): TupleItem[];
        readBuffer(): Buffer;
        readBufferOpt(): Buffer | null;
        readString(): string;
        readStringOpt(): string | null;
    }
}
declare module "tuple/builder" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Address } from "address/Address";
    import { Cell } from "boc/Cell";
    import { Slice } from "boc/Slice";
    import { Maybe } from "utils/maybe";
    import { TupleItem } from "tuple/tuple";
    export class TupleBuilder {
        private _tuple;
        writeNumber(v?: Maybe<bigint | number>): void;
        writeBoolean(v?: Maybe<boolean>): void;
        writeBuffer(v?: Maybe<Buffer | null | undefined>): void;
        writeString(v?: Maybe<string>): void;
        writeCell(v?: Maybe<Cell | Slice>): void;
        writeSlice(v?: Maybe<Cell | Slice>): void;
        writeBuilder(v?: Maybe<Cell | Slice>): void;
        writeTuple(v?: Maybe<TupleItem[]>): void;
        writeAddress(v?: Maybe<Address>): void;
        build(): TupleItem[];
    }
}
declare module "utils/convert" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    export function toNano(src: number | string | bigint): bigint;
    export function fromNano(src: bigint | number | string): string;
}
declare module "types/CurrencyCollection" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Builder } from "boc/Builder";
    import { Slice } from "boc/Slice";
    import { Dictionary } from "dict/Dictionary";
    import { Maybe } from "utils/maybe";
    export interface CurrencyCollection {
        other?: Maybe<Dictionary<number, bigint>>;
        coins: bigint;
    }
    export function loadCurrencyCollection(slice: Slice): CurrencyCollection;
    export function storeCurrencyCollection(collection: CurrencyCollection): (builder: Builder) => void;
}
declare module "types/CommonMessageInfoRelaxed" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Address } from "address/Address";
    import { ExternalAddress } from "address/ExternalAddress";
    import { Builder } from "boc/Builder";
    import { Slice } from "boc/Slice";
    import { Maybe } from "utils/maybe";
    import { CurrencyCollection } from "types/CurrencyCollection";
    export type CommonMessageInfoRelaxed = CommonMessageInfoRelaxedInternal | CommonMessageInfoRelaxedExternalOut;
    export type CommonMessageInfoRelaxedInternal = {
        type: 'internal';
        ihrDisabled: boolean;
        bounce: boolean;
        bounced: boolean;
        src?: Maybe<Address>;
        dest: Address;
        value: CurrencyCollection;
        ihrFee: bigint;
        forwardFee: bigint;
        createdLt: bigint;
        createdAt: number;
    };
    export type CommonMessageInfoRelaxedExternalOut = {
        type: 'external-out';
        src?: Maybe<Address>;
        dest?: Maybe<ExternalAddress>;
        createdLt: bigint;
        createdAt: number;
    };
    export function loadCommonMessageInfoRelaxed(slice: Slice): CommonMessageInfoRelaxed;
    export function storeCommonMessageInfoRelaxed(source: CommonMessageInfoRelaxed): (builder: Builder) => void;
}
declare module "types/MessageRelaxed" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Builder } from "boc/Builder";
    import { Cell } from "boc/Cell";
    import { Slice } from "boc/Slice";
    import { Maybe } from "utils/maybe";
    import { CommonMessageInfoRelaxed } from "types/CommonMessageInfoRelaxed";
    import { StateInit } from "types/StateInit";
    export type MessageRelaxed = {
        info: CommonMessageInfoRelaxed;
        init?: Maybe<StateInit>;
        body: Cell;
    };
    export function loadMessageRelaxed(slice: Slice): MessageRelaxed;
    export function storeMessageRelaxed(message: MessageRelaxed, opts?: {
        forceRef?: boolean;
    }): (builder: Builder) => void;
}
declare module "types/CommonMessageInfo" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Address } from "address/Address";
    import { ExternalAddress } from "address/ExternalAddress";
    import { Builder } from "boc/Builder";
    import { Slice } from "boc/Slice";
    import { Maybe } from "utils/maybe";
    import { CurrencyCollection } from "types/CurrencyCollection";
    export type CommonMessageInfo = CommonMessageInfoInternal | CommonMessageInfoExternalOut | CommonMessageInfoExternalIn;
    export type CommonMessageInfoInternal = {
        type: 'internal';
        ihrDisabled: boolean;
        bounce: boolean;
        bounced: boolean;
        src: Address;
        dest: Address;
        value: CurrencyCollection;
        ihrFee: bigint;
        forwardFee: bigint;
        createdLt: bigint;
        createdAt: number;
    };
    export type CommonMessageInfoExternalIn = {
        type: 'external-in';
        src?: Maybe<ExternalAddress>;
        dest: Address;
        importFee: bigint;
    };
    export type CommonMessageInfoExternalOut = {
        type: 'external-out';
        src: Address;
        dest?: Maybe<ExternalAddress>;
        createdLt: bigint;
        createdAt: number;
    };
    export function loadCommonMessageInfo(slice: Slice): CommonMessageInfo;
    export function storeCommonMessageInfo(source: CommonMessageInfo): (builder: Builder) => void;
}
declare module "types/Message" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Builder } from "boc/Builder";
    import { Cell } from "boc/Cell";
    import { Slice } from "boc/Slice";
    import { DictionaryValue } from "dict/Dictionary";
    import { Maybe } from "utils/maybe";
    import { CommonMessageInfo } from "types/CommonMessageInfo";
    import { StateInit } from "types/StateInit";
    export type Message = {
        info: CommonMessageInfo;
        init?: Maybe<StateInit>;
        body: Cell;
    };
    export function loadMessage(slice: Slice): Message;
    export function storeMessage(message: Message, opts?: {
        forceRef?: boolean;
    }): (builder: Builder) => void;
    export const MessageValue: DictionaryValue<Message>;
}
declare module "types/ExtraCurrency" {
    import { Builder } from "boc/Builder";
    import { Cell } from "boc/Cell";
    import { Slice } from "boc/Slice";
    import { Dictionary } from "dict/Dictionary";
    export type ExtraCurrency = {
        [k: number]: bigint;
    };
    export function loadExtraCurrency(data: Slice | Cell | Dictionary<number, bigint>): ExtraCurrency;
    export function loadMaybeExtraCurrency(data: Slice): ExtraCurrency | null;
    export function storeExtraCurrency(extracurrency: ExtraCurrency): (builder: Builder) => void;
    export function packExtraCurrencyDict(extracurrency: ExtraCurrency): Dictionary<number, bigint>;
    export function packExtraCurrencyCell(extracurrency: ExtraCurrency): Cell;
}
declare module "types/_helpers" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Address } from "address/Address";
    import { Cell } from "boc/Cell";
    import { Maybe } from "utils/maybe";
    import { MessageRelaxed } from "types/MessageRelaxed";
    import { Message } from "types/Message";
    import { StateInit } from "types/StateInit";
    import { ExtraCurrency } from "types/ExtraCurrency";
    export function internal(src: {
        to: Address | string;
        value: bigint | string;
        extracurrency?: Maybe<ExtraCurrency>;
        bounce?: Maybe<boolean>;
        init?: Maybe<StateInit>;
        body?: Maybe<Cell | string>;
    }): MessageRelaxed;
    export function external(src: {
        to: Address | string;
        init?: Maybe<StateInit>;
        body?: Maybe<Cell>;
    }): Message;
    export function comment(src: string): Cell;
}
declare module "types/AccountState" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Builder } from "boc/Builder";
    import { Slice } from "boc/Slice";
    import { StateInit } from "types/StateInit";
    export type AccountState = AccountStateUninit | AccountStateActive | AccountStateFrozen;
    export type AccountStateUninit = {
        type: 'uninit';
    };
    export type AccountStateActive = {
        type: 'active';
        state: StateInit;
    };
    export type AccountStateFrozen = {
        type: 'frozen';
        stateHash: bigint;
    };
    export function loadAccountState(cs: Slice): AccountState;
    export function storeAccountState(src: AccountState): (builder: Builder) => void;
}
declare module "types/AccountStorage" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Builder } from "boc/Builder";
    import { Slice } from "boc/Slice";
    import { AccountState } from "types/AccountState";
    import { CurrencyCollection } from "types/CurrencyCollection";
    export type AccountStorage = {
        lastTransLt: bigint;
        balance: CurrencyCollection;
        state: AccountState;
    };
    export function loadAccountStorage(slice: Slice): AccountStorage;
    export function storeAccountStorage(src: AccountStorage): (builder: Builder) => void;
}
declare module "types/StorageUsed" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Builder } from "boc/Builder";
    import { Slice } from "boc/Slice";
    export type StorageUsed = {
        cells: bigint;
        bits: bigint;
        publicCells: bigint;
    };
    export function loadStorageUsed(cs: Slice): StorageUsed;
    export function storeStorageUsed(src: StorageUsed): (builder: Builder) => void;
}
declare module "types/StorageInto" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Builder } from "boc/Builder";
    import { Slice } from "boc/Slice";
    import { Maybe } from "utils/maybe";
    import { StorageUsed } from "types/StorageUsed";
    export type StorageInfo = {
        used: StorageUsed;
        lastPaid: number;
        duePayment?: Maybe<bigint>;
    };
    export function loadStorageInfo(slice: Slice): StorageInfo;
    export function storeStorageInfo(src: StorageInfo): (builder: Builder) => void;
}
declare module "types/Account" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Address } from "address/Address";
    import { Builder } from "boc/Builder";
    import { Slice } from "boc/Slice";
    import { AccountStorage } from "types/AccountStorage";
    import { StorageInfo } from "types/StorageInto";
    export type Account = {
        addr: Address;
        storageStats: StorageInfo;
        storage: AccountStorage;
    };
    export function loadAccount(slice: Slice): Account;
    export function storeAccount(src: Account): (builder: Builder) => void;
}
declare module "types/AccountStatus" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Builder } from "boc/Builder";
    import { Slice } from "boc/Slice";
    export type AccountStatus = 'uninitialized' | 'frozen' | 'active' | 'non-existing';
    /**
     * Load account state from slice
     * @param slice
     * @returns AccountState
     */
    export function loadAccountStatus(slice: Slice): AccountStatus;
    /**
     * Store account state to builder
     * @param src account state
     * @param builder buidler
     */
    export function storeAccountStatus(src: AccountStatus): (builder: Builder) => Builder;
}
declare module "types/AccountStatusChange" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Builder } from "boc/Builder";
    import { Slice } from "boc/Slice";
    export type AccountStatusChange = 'unchanged' | 'frozen' | 'deleted';
    export function loadAccountStatusChange(slice: Slice): AccountStatusChange;
    export function storeAccountStatusChange(src: AccountStatusChange): (builder: Builder) => void;
}
declare module "types/SendMode" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    export enum SendMode {
        CARRY_ALL_REMAINING_BALANCE = 128,
        CARRY_ALL_REMAINING_INCOMING_VALUE = 64,
        DESTROY_ACCOUNT_IF_ZERO = 32,
        PAY_GAS_SEPARATELY = 1,
        IGNORE_ERRORS = 2,
        NONE = 0
    }
}
declare module "types/LibRef" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Builder } from "boc/Builder";
    import { Cell } from "boc/Cell";
    import { Slice } from "boc/Slice";
    export interface LibRefHash {
        type: 'hash';
        libHash: Buffer;
    }
    export interface LibRefRef {
        type: 'ref';
        library: Cell;
    }
    export type LibRef = LibRefHash | LibRefRef;
    export function loadLibRef(slice: Slice): LibRef;
    export function storeLibRef(src: LibRef): (builder: Builder) => void;
}
declare module "types/ReserveMode" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    export enum ReserveMode {
        THIS_AMOUNT = 0,
        LEAVE_THIS_AMOUNT = 1,
        AT_MOST_THIS_AMOUNT = 2,
        LEAVE_MAX_THIS_AMOUNT = 3,
        BEFORE_BALANCE_PLUS_THIS_AMOUNT = 4,
        LEAVE_BBALANCE_PLUS_THIS_AMOUNT = 5,
        BEFORE_BALANCE_MINUS_THIS_AMOUNT = 12,
        LEAVE_BEFORE_BALANCE_MINUS_THIS_AMOUNT = 13
    }
}
declare module "types/OutList" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { SendMode } from "types/SendMode";
    import { MessageRelaxed } from "types/MessageRelaxed";
    import { Builder } from "boc/Builder";
    import { Cell } from "boc/Cell";
    import { Slice } from "boc/Slice";
    import { CurrencyCollection } from "types/CurrencyCollection";
    import { LibRef } from "types/LibRef";
    import { ReserveMode } from "types/ReserveMode";
    export interface OutActionSendMsg {
        type: 'sendMsg';
        mode: SendMode;
        outMsg: MessageRelaxed;
    }
    export interface OutActionSetCode {
        type: 'setCode';
        newCode: Cell;
    }
    export interface OutActionReserve {
        type: 'reserve';
        mode: ReserveMode;
        currency: CurrencyCollection;
    }
    export interface OutActionChangeLibrary {
        type: 'changeLibrary';
        mode: number;
        libRef: LibRef;
    }
    export type OutAction = OutActionSendMsg | OutActionSetCode | OutActionReserve | OutActionChangeLibrary;
    export function storeOutAction(action: OutAction): (builder: Builder) => void;
    export function loadOutAction(slice: Slice): OutAction;
    export function storeOutList(actions: OutAction[]): (builder: Builder) => void;
    export function loadOutList(slice: Slice): OutAction[];
}
declare module "types/ComputeSkipReason" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Builder } from "boc/Builder";
    import { Slice } from "boc/Slice";
    export type ComputeSkipReason = 'no-state' | 'bad-state' | 'no-gas';
    export function loadComputeSkipReason(slice: Slice): ComputeSkipReason;
    export function storeComputeSkipReason(src: ComputeSkipReason): (builder: Builder) => void;
}
declare module "types/DepthBalanceInfo" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Builder } from "boc/Builder";
    import { Slice } from "boc/Slice";
    import { CurrencyCollection } from "types/CurrencyCollection";
    export type DepthBalanceInfo = {
        splitDepth: number;
        balance: CurrencyCollection;
    };
    export function loadDepthBalanceInfo(slice: Slice): DepthBalanceInfo;
    export function storeDepthBalanceInfo(src: DepthBalanceInfo): (builder: Builder) => void;
}
declare module "types/HashUpdate" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Builder } from "boc/Builder";
    import { Slice } from "boc/Slice";
    export type HashUpdate = {
        oldHash: Buffer;
        newHash: Buffer;
    };
    export function loadHashUpdate(slice: Slice): HashUpdate;
    export function storeHashUpdate(src: HashUpdate): (builder: Builder) => void;
}
declare module "types/MasterchainStateExtra" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Cell } from "boc/Cell";
    import { Slice } from "boc/Slice";
    import { Dictionary } from "dict/Dictionary";
    import { CurrencyCollection } from "types/CurrencyCollection";
    export type MasterchainStateExtra = {
        configAddress: bigint;
        config: Dictionary<number, Cell>;
        globalBalance: CurrencyCollection;
    };
    export function loadMasterchainStateExtra(cs: Slice): MasterchainStateExtra;
}
declare module "types/ShardAccount" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Builder } from "boc/Builder";
    import { Slice } from "boc/Slice";
    import { Maybe } from "utils/maybe";
    import { Account } from "types/Account";
    export type ShardAccount = {
        account?: Maybe<Account>;
        lastTransactionHash: bigint;
        lastTransactionLt: bigint;
    };
    export function loadShardAccount(slice: Slice): ShardAccount;
    export function storeShardAccount(src: ShardAccount): (builder: Builder) => void;
}
declare module "types/ShardAccounts" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Builder } from "boc/Builder";
    import { Slice } from "boc/Slice";
    import { Dictionary, DictionaryValue } from "dict/Dictionary";
    import { DepthBalanceInfo } from "types/DepthBalanceInfo";
    import { ShardAccount } from "types/ShardAccount";
    export type ShardAccountRef = {
        shardAccount: ShardAccount;
        depthBalanceInfo: DepthBalanceInfo;
    };
    export const ShardAccountRefValue: DictionaryValue<ShardAccountRef>;
    export function loadShardAccounts(cs: Slice): Dictionary<bigint, ShardAccountRef>;
    export function storeShardAccounts(src: Dictionary<bigint, ShardAccountRef>): (Builder: Builder) => void;
}
declare module "types/ShardIdent" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Builder } from "boc/Builder";
    import { Slice } from "boc/Slice";
    export type ShardIdent = {
        shardPrefixBits: number;
        workchainId: number;
        shardPrefix: bigint;
    };
    export function loadShardIdent(slice: Slice): ShardIdent;
    export function storeShardIdent(src: ShardIdent): (builder: Builder) => void;
}
declare module "types/ShardStateUnsplit" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Slice } from "boc/Slice";
    import { Dictionary } from "dict/Dictionary";
    import { Maybe } from "utils/maybe";
    import { MasterchainStateExtra } from "types/MasterchainStateExtra";
    import { ShardAccountRef } from "types/ShardAccounts";
    import { ShardIdent } from "types/ShardIdent";
    export type ShardStateUnsplit = {
        globalId: number;
        shardId: ShardIdent;
        seqno: number;
        vertSeqNo: number;
        genUtime: number;
        genLt: bigint;
        minRefMcSeqno: number;
        beforeSplit: boolean;
        accounts?: Maybe<Dictionary<bigint, ShardAccountRef>>;
        extras?: Maybe<MasterchainStateExtra>;
    };
    export function loadShardStateUnsplit(cs: Slice): ShardStateUnsplit;
}
declare module "types/SplitMergeInfo" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Builder } from "boc/Builder";
    import { Slice } from "boc/Slice";
    export type SplitMergeInfo = {
        currentShardPrefixLength: number;
        accountSplitDepth: number;
        thisAddress: bigint;
        siblingAddress: bigint;
    };
    export function loadSplitMergeInfo(slice: Slice): SplitMergeInfo;
    export function storeSplitMergeInfo(src: SplitMergeInfo): (builder: Builder) => void;
}
declare module "types/StorageUsedShort" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Builder } from "boc/Builder";
    import { Slice } from "boc/Slice";
    export type StorageUsedShort = {
        cells: bigint;
        bits: bigint;
    };
    export function loadStorageUsedShort(slice: Slice): StorageUsedShort;
    export function storeStorageUsedShort(src: StorageUsedShort): (builder: Builder) => void;
}
declare module "types/TransactionActionPhase" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Builder } from "boc/Builder";
    import { Slice } from "boc/Slice";
    import { Maybe } from "utils/maybe";
    import { AccountStatusChange } from "types/AccountStatusChange";
    import { StorageUsedShort } from "types/StorageUsedShort";
    export type TransactionActionPhase = {
        success: boolean;
        valid: boolean;
        noFunds: boolean;
        statusChange: AccountStatusChange;
        totalFwdFees?: Maybe<bigint>;
        totalActionFees?: Maybe<bigint>;
        resultCode: number;
        resultArg?: Maybe<number>;
        totalActions: number;
        specActions: number;
        skippedActions: number;
        messagesCreated: number;
        actionListHash: bigint;
        totalMessageSize: StorageUsedShort;
    };
    export function loadTransactionActionPhase(slice: Slice): TransactionActionPhase;
    export function storeTransactionActionPhase(src: TransactionActionPhase): (builder: Builder) => void;
}
declare module "types/TransactionBouncePhase" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Builder } from "boc/Builder";
    import { Slice } from "boc/Slice";
    import { StorageUsedShort } from "types/StorageUsedShort";
    export type TransactionBouncePhase = TransactionBounceNegativeFunds | TransactionBounceNoFunds | TransactionBounceOk;
    export type TransactionBounceNegativeFunds = {
        type: "negative-funds";
    };
    export type TransactionBounceNoFunds = {
        type: "no-funds";
        messageSize: StorageUsedShort;
        requiredForwardFees: bigint;
    };
    export type TransactionBounceOk = {
        type: "ok";
        messageSize: StorageUsedShort;
        messageFees: bigint;
        forwardFees: bigint;
    };
    export function loadTransactionBouncePhase(slice: Slice): TransactionBouncePhase;
    export function storeTransactionBouncePhase(src: TransactionBouncePhase): (builder: Builder) => void;
}
declare module "types/TransactionComputePhase" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Builder } from "boc/Builder";
    import { Slice } from "boc/Slice";
    import { Maybe } from "utils/maybe";
    import { ComputeSkipReason } from "types/ComputeSkipReason";
    export type TransactionComputePhase = TransactionComputeSkipped | TransactionComputeVm;
    export type TransactionComputeSkipped = {
        type: 'skipped';
        reason: ComputeSkipReason;
    };
    export type TransactionComputeVm = {
        type: 'vm';
        success: boolean;
        messageStateUsed: boolean;
        accountActivated: boolean;
        gasFees: bigint;
        gasUsed: bigint;
        gasLimit: bigint;
        gasCredit?: Maybe<bigint>;
        mode: number;
        exitCode: number;
        exitArg?: Maybe<number>;
        vmSteps: number;
        vmInitStateHash: bigint;
        vmFinalStateHash: bigint;
    };
    export function loadTransactionComputePhase(slice: Slice): TransactionComputePhase;
    export function storeTransactionComputePhase(src: TransactionComputePhase): (builder: Builder) => void;
}
declare module "types/TransactionCreditPhase" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Builder } from "boc/Builder";
    import { Slice } from "boc/Slice";
    import { Maybe } from "utils/maybe";
    import { CurrencyCollection } from "types/CurrencyCollection";
    export type TransactionCreditPhase = {
        dueFeesColelcted?: Maybe<bigint>;
        credit: CurrencyCollection;
    };
    export function loadTransactionCreditPhase(slice: Slice): TransactionCreditPhase;
    export function storeTransactionCreditPhase(src: TransactionCreditPhase): (builder: Builder) => void;
}
declare module "types/TransactionStoragePhase" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Builder } from "boc/Builder";
    import { Slice } from "boc/Slice";
    import { Maybe } from "utils/maybe";
    import { AccountStatusChange } from "types/AccountStatusChange";
    export type TransactionStoragePhase = {
        storageFeesCollected: bigint;
        storageFeesDue?: Maybe<bigint>;
        statusChange: AccountStatusChange;
    };
    export function loadTransactionStoragePhase(slice: Slice): TransactionStoragePhase;
    export function storeTransactionsStoragePhase(src: TransactionStoragePhase): (builder: Builder) => void;
}
declare module "types/TransactionDescription" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Builder } from "boc/Builder";
    import { Slice } from "boc/Slice";
    import { Maybe } from "utils/maybe";
    import { SplitMergeInfo } from "types/SplitMergeInfo";
    import { Transaction } from "types/Transaction";
    import { TransactionActionPhase } from "types/TransactionActionPhase";
    import { TransactionBouncePhase } from "types/TransactionBouncePhase";
    import { TransactionComputePhase } from "types/TransactionComputePhase";
    import { TransactionCreditPhase } from "types/TransactionCreditPhase";
    import { TransactionStoragePhase } from "types/TransactionStoragePhase";
    export type TransactionDescription = TransactionDescriptionGeneric | TransactionDescriptionStorage | TransactionDescriptionTickTock | TransactionDescriptionSplitPrepare | TransactionDescriptionSplitInstall | TransactionDescriptionMergePrepare | TransactionDescriptionMergeInstall;
    export type TransactionDescriptionGeneric = {
        type: "generic";
        creditFirst: boolean;
        storagePhase?: Maybe<TransactionStoragePhase>;
        creditPhase?: Maybe<TransactionCreditPhase>;
        computePhase: TransactionComputePhase;
        actionPhase?: Maybe<TransactionActionPhase>;
        bouncePhase?: Maybe<TransactionBouncePhase>;
        aborted: boolean;
        destroyed: boolean;
    };
    export type TransactionDescriptionStorage = {
        type: "storage";
        storagePhase: TransactionStoragePhase;
    };
    export type TransactionDescriptionTickTock = {
        type: "tick-tock";
        isTock: boolean;
        storagePhase: TransactionStoragePhase;
        computePhase: TransactionComputePhase;
        actionPhase?: Maybe<TransactionActionPhase>;
        aborted: boolean;
        destroyed: boolean;
    };
    export type TransactionDescriptionSplitPrepare = {
        type: "split-prepare";
        splitInfo: SplitMergeInfo;
        storagePhase?: Maybe<TransactionStoragePhase>;
        computePhase: TransactionComputePhase;
        actionPhase?: Maybe<TransactionActionPhase>;
        aborted: boolean;
        destroyed: boolean;
    };
    export type TransactionDescriptionSplitInstall = {
        type: "split-install";
        splitInfo: SplitMergeInfo;
        prepareTransaction: Transaction;
        installed: boolean;
    };
    export type TransactionDescriptionMergePrepare = {
        type: "merge-prepare";
        splitInfo: SplitMergeInfo;
        storagePhase: TransactionStoragePhase;
        aborted: boolean;
    };
    export type TransactionDescriptionMergeInstall = {
        type: "merge-install";
        splitInfo: SplitMergeInfo;
        prepareTransaction: Transaction;
        storagePhase?: Maybe<TransactionStoragePhase>;
        creditPhase?: Maybe<TransactionCreditPhase>;
        computePhase: TransactionComputePhase;
        actionPhase?: Maybe<TransactionActionPhase>;
        aborted: boolean;
        destroyed: boolean;
    };
    export function loadTransactionDescription(slice: Slice): TransactionDescription;
    export function storeTransactionDescription(src: TransactionDescription): (builder: Builder) => void;
}
declare module "types/Transaction" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Builder } from "boc/Builder";
    import { Cell } from "boc/Cell";
    import { Slice } from "boc/Slice";
    import { Dictionary } from "dict/Dictionary";
    import { Maybe } from "utils/maybe";
    import { AccountStatus } from "types/AccountStatus";
    import { CurrencyCollection } from "types/CurrencyCollection";
    import { HashUpdate } from "types/HashUpdate";
    import { Message } from "types/Message";
    import { TransactionDescription } from "types/TransactionDescription";
    export type Transaction = {
        address: bigint;
        lt: bigint;
        prevTransactionHash: bigint;
        prevTransactionLt: bigint;
        now: number;
        outMessagesCount: number;
        oldStatus: AccountStatus;
        endStatus: AccountStatus;
        inMessage?: Maybe<Message>;
        outMessages: Dictionary<number, Message>;
        totalFees: CurrencyCollection;
        stateUpdate: HashUpdate;
        description: TransactionDescription;
        raw: Cell;
        hash: () => Buffer;
    };
    export function loadTransaction(slice: Slice): Transaction;
    export function storeTransaction(src: Transaction): (builder: Builder) => void;
}
declare module "types/_export" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    export { internal, external, comment } from "types/_helpers";
    export { Account, loadAccount, storeAccount } from "types/Account";
    export { AccountState, loadAccountState, storeAccountState } from "types/AccountState";
    export { AccountStatus, loadAccountStatus, storeAccountStatus } from "types/AccountStatus";
    export { AccountStatusChange, loadAccountStatusChange, storeAccountStatusChange } from "types/AccountStatusChange";
    export { AccountStorage, loadAccountStorage, storeAccountStorage } from "types/AccountStorage";
    export { OutActionSendMsg, OutActionSetCode, OutActionReserve, OutActionChangeLibrary, OutAction, loadOutAction, storeOutAction, loadOutList, storeOutList } from "types/OutList";
    export { CommonMessageInfo, CommonMessageInfoInternal, CommonMessageInfoExternalIn, CommonMessageInfoExternalOut, loadCommonMessageInfo, storeCommonMessageInfo } from "types/CommonMessageInfo";
    export { CommonMessageInfoRelaxed, CommonMessageInfoRelaxedExternalOut, CommonMessageInfoRelaxedInternal, loadCommonMessageInfoRelaxed, storeCommonMessageInfoRelaxed } from "types/CommonMessageInfoRelaxed";
    export { ComputeSkipReason, loadComputeSkipReason, storeComputeSkipReason } from "types/ComputeSkipReason";
    export { CurrencyCollection, loadCurrencyCollection, storeCurrencyCollection } from "types/CurrencyCollection";
    export { DepthBalanceInfo, loadDepthBalanceInfo, storeDepthBalanceInfo } from "types/DepthBalanceInfo";
    export { ExtraCurrency, packExtraCurrencyCell, packExtraCurrencyDict, loadExtraCurrency, loadMaybeExtraCurrency, storeExtraCurrency } from "types/ExtraCurrency";
    export { HashUpdate, loadHashUpdate, storeHashUpdate } from "types/HashUpdate";
    export { MasterchainStateExtra, loadMasterchainStateExtra } from "types/MasterchainStateExtra";
    export { Message, loadMessage, storeMessage } from "types/Message";
    export { MessageRelaxed, loadMessageRelaxed, storeMessageRelaxed } from "types/MessageRelaxed";
    export { SendMode } from "types/SendMode";
    export { ReserveMode } from "types/ReserveMode";
    export { ShardAccount, loadShardAccount, storeShardAccount } from "types/ShardAccount";
    export { ShardAccountRef, ShardAccountRefValue, loadShardAccounts, storeShardAccounts } from "types/ShardAccounts";
    export { ShardIdent, loadShardIdent, storeShardIdent } from "types/ShardIdent";
    export { ShardStateUnsplit, loadShardStateUnsplit } from "types/ShardStateUnsplit";
    export { SimpleLibrary, loadSimpleLibrary, storeSimpleLibrary } from "types/SimpleLibrary";
    export { LibRef, loadLibRef, storeLibRef } from "types/LibRef";
    export { SplitMergeInfo, loadSplitMergeInfo, storeSplitMergeInfo } from "types/SplitMergeInfo";
    export { StateInit, loadStateInit, storeStateInit } from "types/StateInit";
    export { StorageInfo, loadStorageInfo, storeStorageInfo } from "types/StorageInto";
    export { StorageUsed, loadStorageUsed, storeStorageUsed } from "types/StorageUsed";
    export { StorageUsedShort, loadStorageUsedShort, storeStorageUsedShort } from "types/StorageUsedShort";
    export { TickTock, loadTickTock, storeTickTock } from "types/TickTock";
    export { Transaction, loadTransaction, storeTransaction } from "types/Transaction";
    export { TransactionActionPhase, loadTransactionActionPhase, storeTransactionActionPhase } from "types/TransactionActionPhase";
    export { TransactionBouncePhase, TransactionBounceNoFunds, TransactionBounceNegativeFunds, TransactionBounceOk, loadTransactionBouncePhase, storeTransactionBouncePhase } from "types/TransactionBouncePhase";
    export { TransactionComputeVm, TransactionComputePhase, TransactionComputeSkipped, loadTransactionComputePhase, storeTransactionComputePhase } from "types/TransactionComputePhase";
    export { TransactionCreditPhase, loadTransactionCreditPhase, storeTransactionCreditPhase } from "types/TransactionCreditPhase";
    export { TransactionDescription, TransactionDescriptionGeneric, TransactionDescriptionMergeInstall, TransactionDescriptionMergePrepare, TransactionDescriptionSplitInstall, TransactionDescriptionSplitPrepare, TransactionDescriptionStorage, TransactionDescriptionTickTock, loadTransactionDescription, storeTransactionDescription } from "types/TransactionDescription";
    export { TransactionStoragePhase, loadTransactionStoragePhase, storeTransactionsStoragePhase } from "types/TransactionStoragePhase";
}
declare module "contract/ContractABI" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Maybe } from "utils/maybe";
    export type ABIError = {
        message: string;
    };
    export type ABITypeRef = {
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
    export type ABIField = {
        name: string;
        type: ABITypeRef;
    };
    export type ABIType = {
        name: string;
        header?: Maybe<number>;
        fields: ABIField[];
    };
    export type ABIArgument = {
        name: string;
        type: ABITypeRef;
    };
    export type ABIGetter = {
        name: string;
        methodId?: Maybe<number>;
        arguments?: Maybe<ABIArgument[]>;
        returnType?: Maybe<ABITypeRef>;
    };
    export type ABIReceiverMessage = {
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
    export type ABIReceiver = {
        receiver: 'internal' | 'external';
        message: ABIReceiverMessage;
    };
    export type ContractABI = {
        name?: Maybe<string>;
        types?: Maybe<ABIType[]>;
        errors?: Maybe<{
            [key: number]: ABIError;
        }>;
        getters?: Maybe<ABIGetter[]>;
        receivers?: Maybe<ABIReceiver[]>;
    };
}
declare module "contract/Contract" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Address } from "address/Address";
    import { StateInit } from "types/StateInit";
    import { Maybe } from "utils/maybe";
    import { ContractABI } from "contract/ContractABI";
    export interface Contract {
        readonly address: Address;
        readonly init?: Maybe<StateInit>;
        readonly abi?: Maybe<ContractABI>;
    }
}
declare module "contract/ContractState" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Maybe } from "utils/maybe";
    import { ExtraCurrency } from "types/ExtraCurrency";
    export type ContractState = {
        balance: bigint;
        extracurrency: Maybe<ExtraCurrency>;
        last: {
            lt: bigint;
            hash: Buffer;
        } | null;
        state: {
            type: 'uninit';
        } | {
            type: 'active';
            code: Maybe<Buffer>;
            data: Maybe<Buffer>;
        } | {
            type: 'frozen';
            stateHash: Buffer;
        };
    };
}
declare module "contract/Sender" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Address } from "address/Address";
    import { Cell } from "boc/Cell";
    import { SendMode } from "types/SendMode";
    import { StateInit } from "types/StateInit";
    import { ExtraCurrency } from "types/ExtraCurrency";
    import { Maybe } from "utils/maybe";
    export type SenderArguments = {
        value: bigint;
        to: Address;
        extracurrency?: Maybe<ExtraCurrency>;
        sendMode?: Maybe<SendMode>;
        bounce?: Maybe<boolean>;
        init?: Maybe<StateInit>;
        body?: Maybe<Cell>;
    };
    export interface Sender {
        readonly address?: Address;
        send(args: SenderArguments): Promise<void>;
    }
}
declare module "contract/openContract" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Address } from "address/Address";
    import { StateInit } from "types/StateInit";
    import { Contract } from "contract/Contract";
    import { ContractProvider } from "contract/ContractProvider";
    export type OpenedContract<F> = {
        [P in keyof F]: P extends `${'get' | 'send' | 'is'}${string}` ? (F[P] extends (x: ContractProvider, ...args: infer P) => infer R ? (...args: P) => R : never) : F[P];
    };
    export function openContract<T extends Contract>(src: T, factory: (params: {
        address: Address;
        init: StateInit | null;
    }) => ContractProvider): OpenedContract<T>;
}
declare module "contract/ContractProvider" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Cell } from "boc/Cell";
    import { SendMode } from "types/SendMode";
    import { TupleReader } from "tuple/reader";
    import { TupleItem } from "tuple/tuple";
    import { Maybe } from "utils/maybe";
    import { ContractState } from "contract/ContractState";
    import { Sender } from "contract/Sender";
    import { Contract } from "contract/Contract";
    import { Address } from "address/Address";
    import { Transaction } from "types/Transaction";
    import { ExtraCurrency } from "types/ExtraCurrency";
    import { OpenedContract } from "contract/openContract";
    export type ContractGetMethodResult = {
        stack: TupleReader;
        gasUsed?: Maybe<bigint>;
        logs?: Maybe<string>;
    };
    export interface ContractProvider {
        getState(): Promise<ContractState>;
        get(name: string | number, args: TupleItem[]): Promise<ContractGetMethodResult>;
        external(message: Cell): Promise<void>;
        internal(via: Sender, args: {
            value: bigint | string;
            extracurrency?: ExtraCurrency;
            bounce?: Maybe<boolean>;
            sendMode?: SendMode;
            body?: Maybe<Cell | string>;
        }): Promise<void>;
        open<T extends Contract>(contract: T): OpenedContract<T>;
        getTransactions(address: Address, lt: bigint, hash: Buffer, limit?: number): Promise<Transaction[]>;
    }
}
declare module "contract/ComputeError" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    import { Maybe } from "utils/maybe";
    export class ComputeError extends Error {
        exitCode: number;
        debugLogs: string | null;
        logs: string | null;
        constructor(message: string, exitCode: number, opts?: {
            debugLogs?: Maybe<string>;
            logs?: Maybe<string>;
        });
    }
}
declare module "utils/getMethodId" {
    export function getMethodId(name: string): number;
}
declare module "crypto/safeSign" {
    import { Cell } from "boc/Cell";
    export function safeSign(cell: Cell, secretKey: Buffer, seed?: string): Buffer;
    export function safeSignVerify(cell: Cell, signature: Buffer, publicKey: Buffer, seed?: string): boolean;
}
/// <amd-module name="@ton/core" />
declare module "@ton/core" {
    /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    export { Address, address } from "address/Address";
    export { ExternalAddress } from "address/ExternalAddress";
    export { ADNLAddress } from "address/ADNLAddress";
    export { contractAddress } from "address/contractAddress";
    export { BitString } from "boc/BitString";
    export { BitReader } from "boc/BitReader";
    export { BitBuilder } from "boc/BitBuilder";
    export { Builder, beginCell } from "boc/Builder";
    export { Slice } from "boc/Slice";
    export { Cell, CellType } from "boc/Cell";
    export { Writable } from "boc/Writable";
    export { Dictionary, DictionaryKey, DictionaryKeyTypes, DictionaryValue } from "dict/Dictionary";
    export { exoticMerkleProof, convertToMerkleProof } from "boc/cell/exoticMerkleProof";
    export { exoticMerkleUpdate } from "boc/cell/exoticMerkleUpdate";
    export { exoticPruned } from "boc/cell/exoticPruned";
    export { generateMerkleProof, generateMerkleProofDirect } from "dict/generateMerkleProof";
    export { generateMerkleUpdate } from "dict/generateMerkleUpdate";
    export { Tuple, TupleItem, TupleItemNull, TupleItemInt, TupleItemNaN, TupleItemCell, TupleItemSlice, TupleItemBuilder } from "tuple/tuple";
    export { parseTuple, serializeTuple } from "tuple/tuple";
    export { TupleReader } from "tuple/reader";
    export { TupleBuilder } from "tuple/builder";
    export { internal, external, comment, Account, loadAccount, storeAccount, AccountState, loadAccountState, storeAccountState, AccountStatus, loadAccountStatus, storeAccountStatus, AccountStatusChange, loadAccountStatusChange, storeAccountStatusChange, AccountStorage, loadAccountStorage, storeAccountStorage, OutActionSendMsg, OutActionSetCode, OutActionReserve, OutActionChangeLibrary, OutAction, loadOutAction, storeOutAction, loadOutList, storeOutList, CommonMessageInfo, CommonMessageInfoInternal, CommonMessageInfoExternalIn, CommonMessageInfoExternalOut, loadCommonMessageInfo, storeCommonMessageInfo, CommonMessageInfoRelaxed, CommonMessageInfoRelaxedExternalOut, CommonMessageInfoRelaxedInternal, loadCommonMessageInfoRelaxed, storeCommonMessageInfoRelaxed, ComputeSkipReason, loadComputeSkipReason, storeComputeSkipReason, CurrencyCollection, loadCurrencyCollection, storeCurrencyCollection, DepthBalanceInfo, loadDepthBalanceInfo, storeDepthBalanceInfo, ExtraCurrency, packExtraCurrencyCell, packExtraCurrencyDict, loadExtraCurrency, loadMaybeExtraCurrency, storeExtraCurrency, HashUpdate, loadHashUpdate, storeHashUpdate, MasterchainStateExtra, loadMasterchainStateExtra, Message, loadMessage, storeMessage, MessageRelaxed, loadMessageRelaxed, storeMessageRelaxed, SendMode, ReserveMode, ShardAccount, loadShardAccount, storeShardAccount, ShardAccountRef, ShardAccountRefValue, loadShardAccounts, storeShardAccounts, ShardIdent, loadShardIdent, storeShardIdent, ShardStateUnsplit, loadShardStateUnsplit, SimpleLibrary, loadSimpleLibrary, storeSimpleLibrary, LibRef, loadLibRef, storeLibRef, SplitMergeInfo, loadSplitMergeInfo, storeSplitMergeInfo, StateInit, loadStateInit, storeStateInit, StorageInfo, loadStorageInfo, storeStorageInfo, StorageUsed, loadStorageUsed, storeStorageUsed, StorageUsedShort, loadStorageUsedShort, storeStorageUsedShort, TickTock, loadTickTock, storeTickTock, Transaction, loadTransaction, storeTransaction, TransactionActionPhase, loadTransactionActionPhase, storeTransactionActionPhase, TransactionBouncePhase, TransactionBounceNoFunds, TransactionBounceNegativeFunds, TransactionBounceOk, loadTransactionBouncePhase, storeTransactionBouncePhase, TransactionComputeVm, TransactionComputePhase, TransactionComputeSkipped, loadTransactionComputePhase, storeTransactionComputePhase, TransactionCreditPhase, loadTransactionCreditPhase, storeTransactionCreditPhase, TransactionDescription, TransactionDescriptionGeneric, TransactionDescriptionMergeInstall, TransactionDescriptionMergePrepare, TransactionDescriptionSplitInstall, TransactionDescriptionSplitPrepare, TransactionDescriptionStorage, TransactionDescriptionTickTock, loadTransactionDescription, storeTransactionDescription, TransactionStoragePhase, loadTransactionStoragePhase, storeTransactionsStoragePhase } from "types/_export";
    export { Contract } from "contract/Contract";
    export { ContractProvider, ContractGetMethodResult } from "contract/ContractProvider";
    export { ContractState } from "contract/ContractState";
    export { Sender, SenderArguments } from "contract/Sender";
    export { openContract, OpenedContract } from "contract/openContract";
    export { ComputeError } from "contract/ComputeError";
    export { ContractABI, ABIError, ABITypeRef, ABIField, ABIArgument, ABIGetter, ABIType, ABIReceiverMessage, ABIReceiver } from "contract/ContractABI";
    export { toNano, fromNano } from "utils/convert";
    export { crc16 } from "utils/crc16";
    export { crc32c } from "utils/crc32c";
    export { base32Decode, base32Encode } from "utils/base32";
    export { getMethodId } from "utils/getMethodId";
    export { Maybe } from "utils/maybe";
    export { safeSign, safeSignVerify } from "crypto/safeSign";
    export { paddedBufferToBits } from "boc/utils/paddedBits";
}
declare module "utils/testAddress" {
    import { Address } from "address/Address";
    import { ExternalAddress } from "address/ExternalAddress";
    export function testAddress(workchain: number, seed: string): Address;
    export function testExternalAddress(seed: string): ExternalAddress;
}

/// <amd-module name="@ijstech/ton-core" />
declare module "@ijstech/ton-core" {
      /**
     * Copyright (c) Whales Corp.
     * All Rights Reserved.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    export { Address, address } from "address/Address";
    export { ExternalAddress } from "address/ExternalAddress";
    export { ADNLAddress } from "address/ADNLAddress";
    export { contractAddress } from "address/contractAddress";
    export { BitString } from "boc/BitString";
    export { BitReader } from "boc/BitReader";
    export { BitBuilder } from "boc/BitBuilder";
    export { Builder, beginCell } from "boc/Builder";
    export { Slice } from "boc/Slice";
    export { Cell, CellType } from "boc/Cell";
    export { Writable } from "boc/Writable";
    export { Dictionary, DictionaryKey, DictionaryKeyTypes, DictionaryValue } from "dict/Dictionary";
    export { exoticMerkleProof, convertToMerkleProof } from "boc/cell/exoticMerkleProof";
    export { exoticMerkleUpdate } from "boc/cell/exoticMerkleUpdate";
    export { exoticPruned } from "boc/cell/exoticPruned";
    export { generateMerkleProof, generateMerkleProofDirect } from "dict/generateMerkleProof";
    export { generateMerkleUpdate } from "dict/generateMerkleUpdate";
    export { Tuple, TupleItem, TupleItemNull, TupleItemInt, TupleItemNaN, TupleItemCell, TupleItemSlice, TupleItemBuilder } from "tuple/tuple";
    export { parseTuple, serializeTuple } from "tuple/tuple";
    export { TupleReader } from "tuple/reader";
    export { TupleBuilder } from "tuple/builder";
    export { internal, external, comment, Account, loadAccount, storeAccount, AccountState, loadAccountState, storeAccountState, AccountStatus, loadAccountStatus, storeAccountStatus, AccountStatusChange, loadAccountStatusChange, storeAccountStatusChange, AccountStorage, loadAccountStorage, storeAccountStorage, OutActionSendMsg, OutActionSetCode, OutActionReserve, OutActionChangeLibrary, OutAction, loadOutAction, storeOutAction, loadOutList, storeOutList, CommonMessageInfo, CommonMessageInfoInternal, CommonMessageInfoExternalIn, CommonMessageInfoExternalOut, loadCommonMessageInfo, storeCommonMessageInfo, CommonMessageInfoRelaxed, CommonMessageInfoRelaxedExternalOut, CommonMessageInfoRelaxedInternal, loadCommonMessageInfoRelaxed, storeCommonMessageInfoRelaxed, ComputeSkipReason, loadComputeSkipReason, storeComputeSkipReason, CurrencyCollection, loadCurrencyCollection, storeCurrencyCollection, DepthBalanceInfo, loadDepthBalanceInfo, storeDepthBalanceInfo, ExtraCurrency, packExtraCurrencyCell, packExtraCurrencyDict, loadExtraCurrency, loadMaybeExtraCurrency, storeExtraCurrency, HashUpdate, loadHashUpdate, storeHashUpdate, MasterchainStateExtra, loadMasterchainStateExtra, Message, loadMessage, storeMessage, MessageRelaxed, loadMessageRelaxed, storeMessageRelaxed, SendMode, ReserveMode, ShardAccount, loadShardAccount, storeShardAccount, ShardAccountRef, ShardAccountRefValue, loadShardAccounts, storeShardAccounts, ShardIdent, loadShardIdent, storeShardIdent, ShardStateUnsplit, loadShardStateUnsplit, SimpleLibrary, loadSimpleLibrary, storeSimpleLibrary, LibRef, loadLibRef, storeLibRef, SplitMergeInfo, loadSplitMergeInfo, storeSplitMergeInfo, StateInit, loadStateInit, storeStateInit, StorageInfo, loadStorageInfo, storeStorageInfo, StorageUsed, loadStorageUsed, storeStorageUsed, StorageUsedShort, loadStorageUsedShort, storeStorageUsedShort, TickTock, loadTickTock, storeTickTock, Transaction, loadTransaction, storeTransaction, TransactionActionPhase, loadTransactionActionPhase, storeTransactionActionPhase, TransactionBouncePhase, TransactionBounceNoFunds, TransactionBounceNegativeFunds, TransactionBounceOk, loadTransactionBouncePhase, storeTransactionBouncePhase, TransactionComputeVm, TransactionComputePhase, TransactionComputeSkipped, loadTransactionComputePhase, storeTransactionComputePhase, TransactionCreditPhase, loadTransactionCreditPhase, storeTransactionCreditPhase, TransactionDescription, TransactionDescriptionGeneric, TransactionDescriptionMergeInstall, TransactionDescriptionMergePrepare, TransactionDescriptionSplitInstall, TransactionDescriptionSplitPrepare, TransactionDescriptionStorage, TransactionDescriptionTickTock, loadTransactionDescription, storeTransactionDescription, TransactionStoragePhase, loadTransactionStoragePhase, storeTransactionsStoragePhase } from "types/_export";
    export { Contract } from "contract/Contract";
    export { ContractProvider, ContractGetMethodResult } from "contract/ContractProvider";
    export { ContractState } from "contract/ContractState";
    export { Sender, SenderArguments } from "contract/Sender";
    export { openContract, OpenedContract } from "contract/openContract";
    export { ComputeError } from "contract/ComputeError";
    export { ContractABI, ABIError, ABITypeRef, ABIField, ABIArgument, ABIGetter, ABIType, ABIReceiverMessage, ABIReceiver } from "contract/ContractABI";
    export { toNano, fromNano } from "utils/convert";
    export { crc16 } from "utils/crc16";
    export { crc32c } from "utils/crc32c";
    export { base32Decode, base32Encode } from "utils/base32";
    export { getMethodId } from "utils/getMethodId";
    export { Maybe } from "utils/maybe";
    export { safeSign, safeSignVerify } from "crypto/safeSign";
    export { paddedBufferToBits } from "boc/utils/paddedBits";
}
