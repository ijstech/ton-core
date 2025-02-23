"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMerkleUpdate = void 0;
const Builder_1 = require("../boc/Builder");
const generateMerkleProof_1 = require("./generateMerkleProof");
function convertToMerkleUpdate(c1, c2) {
    return (0, Builder_1.beginCell)()
        .storeUint(4, 8)
        .storeBuffer(c1.hash(0))
        .storeBuffer(c2.hash(0))
        .storeUint(c1.depth(0), 16)
        .storeUint(c2.depth(0), 16)
        .storeRef(c1)
        .storeRef(c2)
        .endCell({ exotic: true });
}
function generateMerkleUpdate(dict, key, keyObject, newValue) {
    const oldProof = (0, generateMerkleProof_1.generateMerkleProof)(dict, [key], keyObject).refs[0];
    dict.set(key, newValue);
    const newProof = (0, generateMerkleProof_1.generateMerkleProof)(dict, [key], keyObject).refs[0];
    return convertToMerkleUpdate(oldProof, newProof);
}
exports.generateMerkleUpdate = generateMerkleUpdate;
