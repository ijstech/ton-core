"use strict";
/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dictionary = void 0;
const Address_1 = require("../address/Address");
const Builder_1 = require("../boc/Builder");
const Cell_1 = require("../boc/Cell");
const BitString_1 = require("../boc/BitString");
const generateMerkleProof_1 = require("./generateMerkleProof");
const generateMerkleUpdate_1 = require("./generateMerkleUpdate");
const parseDict_1 = require("./parseDict");
const serializeDict_1 = require("./serializeDict");
const internalKeySerializer_1 = require("./utils/internalKeySerializer");
class Dictionary {
    constructor(values, key, value) {
        this._key = key;
        this._value = value;
        this._map = values;
    }
    /**
     * Create an empty map
     * @param key key type
     * @param value value type
     * @returns Dictionary<K, V>
     */
    static empty(key, value) {
        if (key && value) {
            return new Dictionary(new Map(), key, value);
        }
        else {
            return new Dictionary(new Map(), null, null);
        }
    }
    /**
     * Load dictionary from slice
     * @param key key description
     * @param value value description
     * @param src slice
     * @returns Dictionary<K, V>
     */
    static load(key, value, sc) {
        let slice;
        if (sc instanceof Cell_1.Cell) {
            if (sc.isExotic) {
                return Dictionary.empty(key, value);
            }
            slice = sc.beginParse();
        }
        else {
            slice = sc;
        }
        let cell = slice.loadMaybeRef();
        if (cell && !cell.isExotic) {
            return Dictionary.loadDirect(key, value, cell.beginParse());
        }
        else {
            return Dictionary.empty(key, value);
        }
    }
    /**
     * Low level method for rare dictionaries from system contracts.
     * Loads dictionary from slice directly without going to the ref.
     *
     * @param key key description
     * @param value value description
     * @param sc slice
     * @returns Dictionary<K, V>
     */
    static loadDirect(key, value, sc) {
        if (!sc) {
            return Dictionary.empty(key, value);
        }
        let slice;
        if (sc instanceof Cell_1.Cell) {
            slice = sc.beginParse();
        }
        else {
            slice = sc;
        }
        let values = (0, parseDict_1.parseDict)(slice, key.bits, value.parse);
        let prepare = new Map();
        for (let [k, v] of values) {
            prepare.set((0, internalKeySerializer_1.serializeInternalKey)(key.parse(k)), v);
        }
        return new Dictionary(prepare, key, value);
    }
    get size() {
        return this._map.size;
    }
    get(key) {
        return this._map.get((0, internalKeySerializer_1.serializeInternalKey)(key));
    }
    has(key) {
        return this._map.has((0, internalKeySerializer_1.serializeInternalKey)(key));
    }
    set(key, value) {
        this._map.set((0, internalKeySerializer_1.serializeInternalKey)(key), value);
        return this;
    }
    delete(key) {
        const k = (0, internalKeySerializer_1.serializeInternalKey)(key);
        return this._map.delete(k);
    }
    clear() {
        this._map.clear();
    }
    *[Symbol.iterator]() {
        for (const [k, v] of this._map) {
            const key = (0, internalKeySerializer_1.deserializeInternalKey)(k);
            yield [key, v];
        }
    }
    keys() {
        return Array.from(this._map.keys()).map((v) => (0, internalKeySerializer_1.deserializeInternalKey)(v));
    }
    values() {
        return Array.from(this._map.values());
    }
    store(builder, key, value) {
        if (this._map.size === 0) {
            builder.storeBit(0);
        }
        else {
            // Resolve serializer
            let resolvedKey = this._key;
            if (key !== null && key !== undefined) {
                resolvedKey = key;
            }
            let resolvedValue = this._value;
            if (value !== null && value !== undefined) {
                resolvedValue = value;
            }
            if (!resolvedKey) {
                throw Error('Key serializer is not defined');
            }
            if (!resolvedValue) {
                throw Error('Value serializer is not defined');
            }
            // Prepare map
            let prepared = new Map();
            for (const [k, v] of this._map) {
                prepared.set(resolvedKey.serialize((0, internalKeySerializer_1.deserializeInternalKey)(k)), v);
            }
            // Store
            builder.storeBit(1);
            let dd = (0, Builder_1.beginCell)();
            (0, serializeDict_1.serializeDict)(prepared, resolvedKey.bits, resolvedValue.serialize, dd);
            builder.storeRef(dd.endCell());
        }
    }
    storeDirect(builder, key, value) {
        if (this._map.size === 0) {
            throw Error('Cannot store empty dictionary directly');
        }
        // Resolve serializer
        let resolvedKey = this._key;
        if (key !== null && key !== undefined) {
            resolvedKey = key;
        }
        let resolvedValue = this._value;
        if (value !== null && value !== undefined) {
            resolvedValue = value;
        }
        if (!resolvedKey) {
            throw Error('Key serializer is not defined');
        }
        if (!resolvedValue) {
            throw Error('Value serializer is not defined');
        }
        // Prepare map
        let prepared = new Map();
        for (const [k, v] of this._map) {
            prepared.set(resolvedKey.serialize((0, internalKeySerializer_1.deserializeInternalKey)(k)), v);
        }
        // Store
        (0, serializeDict_1.serializeDict)(prepared, resolvedKey.bits, resolvedValue.serialize, builder);
    }
    /**
     * Generate merkle proof for multiple keys in the dictionary
     * @param keys an array of the keys
     * @returns generated merkle proof cell
     */
    generateMerkleProof(keys) {
        return (0, generateMerkleProof_1.generateMerkleProof)(this, keys, this._key);
    }
    /**
     * Low level method for generating pruned dictionary directly.
     * The result can be used as a part of a bigger merkle proof
     * @param keys an array of the keys
     * @returns cell that contains the pruned dictionary
     */
    generateMerkleProofDirect(keys) {
        return (0, generateMerkleProof_1.generateMerkleProofDirect)(this, keys, this._key);
    }
    generateMerkleUpdate(key, newValue) {
        return (0, generateMerkleUpdate_1.generateMerkleUpdate)(this, key, this._key, newValue);
    }
}
exports.Dictionary = Dictionary;
Dictionary.Keys = {
    /**
     * Standard address key
     * @returns DictionaryKey<Address>
     */
    Address: () => {
        return createAddressKey();
    },
    /**
     * Create standard big integer key
     * @param bits number of bits
     * @returns DictionaryKey<bigint>
     */
    BigInt: (bits) => {
        return createBigIntKey(bits);
    },
    /**
     * Create integer key
     * @param bits bits of integer
     * @returns DictionaryKey<number>
     */
    Int: (bits) => {
        return createIntKey(bits);
    },
    /**
     * Create standard unsigned big integer key
     * @param bits number of bits
     * @returns DictionaryKey<bigint>
     */
    BigUint: (bits) => {
        return createBigUintKey(bits);
    },
    /**
     * Create standard unsigned integer key
     * @param bits number of bits
     * @returns DictionaryKey<number>
     */
    Uint: (bits) => {
        return createUintKey(bits);
    },
    /**
     * Create standard buffer key
     * @param bytes number of bytes of a buffer
     * @returns DictionaryKey<Buffer>
     */
    Buffer: (bytes) => {
        return createBufferKey(bytes);
    },
    /**
     * Create BitString key
     * @param bits key length
     * @returns DictionaryKey<BitString>
     * Point is that Buffer has to be 8 bit aligned,
     * while key is TVM dictionary doesn't have to be
     * aligned at all.
     */
    BitString: (bits) => {
        return createBitStringKey(bits);
    }
};
Dictionary.Values = {
    /**
     * Create standard integer value
     * @returns DictionaryValue<bigint>
     */
    BigInt: (bits) => {
        return createBigIntValue(bits);
    },
    /**
     * Create standard integer value
     * @returns DictionaryValue<number>
     */
    Int: (bits) => {
        return createIntValue(bits);
    },
    /**
     * Create big var int
     * @param bits nubmer of header bits
     * @returns DictionaryValue<bigint>
     */
    BigVarInt: (bits) => {
        return createBigVarIntValue(bits);
    },
    /**
     * Create standard unsigned integer value
     * @param bits number of bits
     * @returns DictionaryValue<bigint>
     */
    BigUint: (bits) => {
        return createBigUintValue(bits);
    },
    /**
     * Create standard unsigned integer value
     * @param bits number of bits
     * @returns DictionaryValue<bigint>
     */
    Uint: (bits) => {
        return createUintValue(bits);
    },
    /**
     * Create big var int
     * @param bits nubmer of header bits
     * @returns DictionaryValue<bigint>
     */
    BigVarUint: (bits) => {
        return createBigVarUintValue(bits);
    },
    /**
     * Create standard boolean value
     * @returns DictionaryValue<boolean>
     */
    Bool: () => {
        return createBooleanValue();
    },
    /**
     * Create standard address value
     * @returns DictionaryValue<Address>
     */
    Address: () => {
        return createAddressValue();
    },
    /**
     * Create standard cell value
     * @returns DictionaryValue<Cell>
     */
    Cell: () => {
        return createCellValue();
    },
    /**
     * Create Builder value
     * @param bytes number of bytes of a buffer
     * @returns DictionaryValue<Builder>
     */
    Buffer: (bytes) => {
        return createBufferValue(bytes);
    },
    /**
     * Create BitString value
     * @param requested bit length
     * @returns DictionaryValue<BitString>
     * Point is that Buffer is not applicable
     * when length is not 8 bit alligned.
     */
    BitString: (bits) => {
        return createBitStringValue(bits);
    },
    /**
     * Create dictionary value
     * @param key
     * @param value
     */
    Dictionary: (key, value) => {
        return createDictionaryValue(key, value);
    }
};
//
// Keys and Values
//
function createAddressKey() {
    return {
        bits: 267,
        serialize: (src) => {
            if (!Address_1.Address.isAddress(src)) {
                throw Error('Key is not an address');
            }
            return (0, Builder_1.beginCell)().storeAddress(src).endCell().beginParse().preloadUintBig(267);
        },
        parse: (src) => {
            return (0, Builder_1.beginCell)().storeUint(src, 267).endCell().beginParse().loadAddress();
        }
    };
}
function createBigIntKey(bits) {
    return {
        bits,
        serialize: (src) => {
            if (typeof src !== 'bigint') {
                throw Error('Key is not a bigint');
            }
            return (0, Builder_1.beginCell)().storeInt(src, bits).endCell().beginParse().loadUintBig(bits);
        },
        parse: (src) => {
            return (0, Builder_1.beginCell)().storeUint(src, bits).endCell().beginParse().loadIntBig(bits);
        }
    };
}
function createIntKey(bits) {
    return {
        bits: bits,
        serialize: (src) => {
            if (typeof src !== 'number') {
                throw Error('Key is not a number');
            }
            if (!Number.isSafeInteger(src)) {
                throw Error('Key is not a safe integer: ' + src);
            }
            return (0, Builder_1.beginCell)().storeInt(src, bits).endCell().beginParse().loadUintBig(bits);
        },
        parse: (src) => {
            return (0, Builder_1.beginCell)().storeUint(src, bits).endCell().beginParse().loadInt(bits);
        }
    };
}
function createBigUintKey(bits) {
    return {
        bits,
        serialize: (src) => {
            if (typeof src !== 'bigint') {
                throw Error('Key is not a bigint');
            }
            if (src < 0) {
                throw Error('Key is negative: ' + src);
            }
            return (0, Builder_1.beginCell)().storeUint(src, bits).endCell().beginParse().loadUintBig(bits);
        },
        parse: (src) => {
            return (0, Builder_1.beginCell)().storeUint(src, bits).endCell().beginParse().loadUintBig(bits);
        }
    };
}
function createUintKey(bits) {
    return {
        bits,
        serialize: (src) => {
            if (typeof src !== 'number') {
                throw Error('Key is not a number');
            }
            if (!Number.isSafeInteger(src)) {
                throw Error('Key is not a safe integer: ' + src);
            }
            if (src < 0) {
                throw Error('Key is negative: ' + src);
            }
            return (0, Builder_1.beginCell)().storeUint(src, bits).endCell().beginParse().loadUintBig(bits);
        },
        parse: (src) => {
            return Number((0, Builder_1.beginCell)().storeUint(src, bits).endCell().beginParse().loadUint(bits));
        }
    };
}
function createBufferKey(bytes) {
    return {
        bits: bytes * 8,
        serialize: (src) => {
            if (!Buffer.isBuffer(src)) {
                throw Error('Key is not a buffer');
            }
            return (0, Builder_1.beginCell)().storeBuffer(src).endCell().beginParse().loadUintBig(bytes * 8);
        },
        parse: (src) => {
            return (0, Builder_1.beginCell)().storeUint(src, bytes * 8).endCell().beginParse().loadBuffer(bytes);
        }
    };
}
function createBitStringKey(bits) {
    return {
        bits,
        serialize: (src) => {
            if (!BitString_1.BitString.isBitString(src))
                throw Error('Key is not a BitString');
            return (0, Builder_1.beginCell)().storeBits(src).endCell().beginParse().loadUintBig(bits);
        },
        parse: (src) => {
            return (0, Builder_1.beginCell)().storeUint(src, bits).endCell().beginParse().loadBits(bits);
        }
    };
}
function createIntValue(bits) {
    return {
        serialize: (src, buidler) => {
            buidler.storeInt(src, bits);
        },
        parse: (src) => {
            return src.loadInt(bits);
        }
    };
}
function createBigIntValue(bits) {
    return {
        serialize: (src, buidler) => {
            buidler.storeInt(src, bits);
        },
        parse: (src) => {
            return src.loadIntBig(bits);
        }
    };
}
function createBigVarIntValue(bits) {
    return {
        serialize: (src, buidler) => {
            buidler.storeVarInt(src, bits);
        },
        parse: (src) => {
            return src.loadVarIntBig(bits);
        }
    };
}
function createBigVarUintValue(bits) {
    return {
        serialize: (src, buidler) => {
            buidler.storeVarUint(src, bits);
        },
        parse: (src) => {
            return src.loadVarUintBig(bits);
        }
    };
}
function createUintValue(bits) {
    return {
        serialize: (src, buidler) => {
            buidler.storeUint(src, bits);
        },
        parse: (src) => {
            return src.loadUint(bits);
        }
    };
}
function createBigUintValue(bits) {
    return {
        serialize: (src, buidler) => {
            buidler.storeUint(src, bits);
        },
        parse: (src) => {
            return src.loadUintBig(bits);
        }
    };
}
function createBooleanValue() {
    return {
        serialize: (src, buidler) => {
            buidler.storeBit(src);
        },
        parse: (src) => {
            return src.loadBit();
        }
    };
}
function createAddressValue() {
    return {
        serialize: (src, buidler) => {
            buidler.storeAddress(src);
        },
        parse: (src) => {
            return src.loadAddress();
        }
    };
}
function createCellValue() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(src);
        },
        parse: (src) => {
            return src.loadRef();
        }
    };
}
function createDictionaryValue(key, value) {
    return {
        serialize: (src, buidler) => {
            src.store(buidler);
        },
        parse: (src) => {
            return Dictionary.load(key, value, src);
        }
    };
}
function createBufferValue(size) {
    return {
        serialize: (src, buidler) => {
            if (src.length !== size) {
                throw Error('Invalid buffer size');
            }
            buidler.storeBuffer(src);
        },
        parse: (src) => {
            return src.loadBuffer(size);
        }
    };
}
function createBitStringValue(bits) {
    return {
        serialize: (src, builder) => {
            if (src.length !== bits) {
                throw Error('Invalid BitString size');
            }
            builder.storeBits(src);
        },
        parse: (src) => {
            return src.loadBits(bits);
        }
    };
}
