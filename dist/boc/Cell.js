"use strict";
/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CellType = exports.Cell = void 0;
const BitString_1 = require("./BitString");
const CellType_1 = require("./CellType");
Object.defineProperty(exports, "CellType", { enumerable: true, get: function () { return CellType_1.CellType; } });
const Slice_1 = require("./Slice");
const resolveExotic_1 = require("./cell/resolveExotic");
const wonderCalculator_1 = require("./cell/wonderCalculator");
const serialization_1 = require("./cell/serialization");
const BitReader_1 = require("./BitReader");
const Builder_1 = require("./Builder");
/**
 * Cell as described in TVM spec
 */
class Cell {
    constructor(opts) {
        // Level and depth information
        this._hashes = [];
        this._depths = [];
        /**
         * Beging cell parsing
         * @returns a new slice
         */
        this.beginParse = (allowExotic = false) => {
            if (this.isExotic && !allowExotic) {
                throw new Error("Exotic cells cannot be parsed");
            }
            return new Slice_1.Slice(new BitReader_1.BitReader(this.bits), this.refs);
        };
        /**
         * Get cell hash
         * @param level level
         * @returns cell hash
         */
        this.hash = (level = 3) => {
            return this._hashes[Math.min(this._hashes.length - 1, level)];
        };
        /**
         * Get cell depth
         * @param level level
         * @returns cell depth
         */
        this.depth = (level = 3) => {
            return this._depths[Math.min(this._depths.length - 1, level)];
        };
        /**
         * Get cell level
         * @returns cell level
         */
        this.level = () => {
            return this.mask.level;
        };
        /**
         * Checks cell to be euqal to another cell
         * @param other other cell
         * @returns true if cells are equal
         */
        this.equals = (other) => {
            return this.hash().equals(other.hash());
        };
        // Resolve bits
        let bits = BitString_1.BitString.EMPTY;
        if (opts && opts.bits) {
            bits = opts.bits;
        }
        // Resolve refs
        let refs = [];
        if (opts && opts.refs) {
            refs = [...opts.refs];
        }
        // Resolve type
        let hashes;
        let depths;
        let mask;
        let type = CellType_1.CellType.Ordinary;
        if (opts && opts.exotic) {
            // Resolve exotic cell
            let resolved = (0, resolveExotic_1.resolveExotic)(bits, refs);
            // Perform wonders
            let wonders = (0, wonderCalculator_1.wonderCalculator)(resolved.type, bits, refs);
            // Copy results
            mask = wonders.mask;
            depths = wonders.depths;
            hashes = wonders.hashes;
            type = resolved.type;
        }
        else {
            // Check correctness
            if (refs.length > 4) {
                throw new Error("Invalid number of references");
            }
            if (bits.length > 1023) {
                throw new Error(`Bits overflow: ${bits.length} > 1023`);
            }
            // Perform wonders
            let wonders = (0, wonderCalculator_1.wonderCalculator)(CellType_1.CellType.Ordinary, bits, refs);
            // Copy results
            mask = wonders.mask;
            depths = wonders.depths;
            hashes = wonders.hashes;
            type = CellType_1.CellType.Ordinary;
        }
        // Set fields
        this.type = type;
        this.bits = bits;
        this.refs = refs;
        this.mask = mask;
        this._depths = depths;
        this._hashes = hashes;
        Object.freeze(this);
        Object.freeze(this.refs);
        Object.freeze(this.bits);
        Object.freeze(this.mask);
        Object.freeze(this._depths);
        Object.freeze(this._hashes);
    }
    /**
     * Deserialize cells from BOC
     * @param src source buffer
     * @returns array of cells
     */
    static fromBoc(src) {
        return (0, serialization_1.deserializeBoc)(src);
    }
    /**
     * Helper function that deserializes a single cell from BOC in base64
     * @param src source string
     */
    static fromBase64(src) {
        let parsed = Cell.fromBoc(Buffer.from(src, 'base64'));
        if (parsed.length !== 1) {
            throw new Error("Deserialized more than one cell");
        }
        return parsed[0];
    }
    /**
     * Helper function that deserializes a single cell from BOC in hex
     * @param src source string
     */
    static fromHex(src) {
        let parsed = Cell.fromBoc(Buffer.from(src, 'hex'));
        if (parsed.length !== 1) {
            throw new Error("Deserialized more than one cell");
        }
        return parsed[0];
    }
    /**
     * Check if cell is exotic
     */
    get isExotic() {
        return this.type !== CellType_1.CellType.Ordinary;
    }
    /**
     * Serializes cell to BOC
     * @param opts options
     */
    toBoc(opts) {
        let idx = (opts && opts.idx !== null && opts.idx !== undefined) ? opts.idx : false;
        let crc32 = (opts && opts.crc32 !== null && opts.crc32 !== undefined) ? opts.crc32 : true;
        return (0, serialization_1.serializeBoc)(this, { idx, crc32 });
    }
    /**
     * Format cell to string
     * @param indent indentation
     * @returns string representation
     */
    toString(indent) {
        let id = indent || '';
        let t = 'x';
        if (this.isExotic) {
            if (this.type === CellType_1.CellType.MerkleProof) {
                t = 'p';
            }
            else if (this.type === CellType_1.CellType.MerkleUpdate) {
                t = 'u';
            }
            else if (this.type === CellType_1.CellType.PrunedBranch) {
                t = 'p';
            }
        }
        let s = id + (this.isExotic ? t : 'x') + '{' + this.bits.toString() + '}';
        for (let k in this.refs) {
            const i = this.refs[k];
            s += '\n' + i.toString(id + ' ');
        }
        return s;
    }
    /**
     * Covnert cell to slice
     * @returns slice
     */
    asSlice() {
        return this.beginParse();
    }
    /**
     * Convert cell to a builder that has this cell stored
     * @returns builder
     */
    asBuilder() {
        return (0, Builder_1.beginCell)().storeSlice(this.asSlice());
    }
}
exports.Cell = Cell;
Cell.EMPTY = new Cell();
