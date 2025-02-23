"use strict";
/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeTransactionComputePhase = exports.loadTransactionComputePhase = void 0;
const Builder_1 = require("../boc/Builder");
const ComputeSkipReason_1 = require("./ComputeSkipReason");
function loadTransactionComputePhase(slice) {
    // Skipped
    if (!slice.loadBit()) {
        let reason = (0, ComputeSkipReason_1.loadComputeSkipReason)(slice);
        return {
            type: 'skipped',
            reason
        };
    }
    let success = slice.loadBit();
    let messageStateUsed = slice.loadBit();
    let accountActivated = slice.loadBit();
    let gasFees = slice.loadCoins();
    const vmState = slice.loadRef().beginParse();
    let gasUsed = vmState.loadVarUintBig(3);
    let gasLimit = vmState.loadVarUintBig(3);
    let gasCredit = vmState.loadBit() ? vmState.loadVarUintBig(2) : undefined;
    let mode = vmState.loadUint(8);
    let exitCode = vmState.loadInt(32);
    let exitArg = vmState.loadBit() ? vmState.loadInt(32) : undefined;
    let vmSteps = vmState.loadUint(32);
    let vmInitStateHash = vmState.loadUintBig(256);
    let vmFinalStateHash = vmState.loadUintBig(256);
    return {
        type: 'vm',
        success,
        messageStateUsed,
        accountActivated,
        gasFees,
        gasUsed,
        gasLimit,
        gasCredit,
        mode,
        exitCode,
        exitArg,
        vmSteps,
        vmInitStateHash,
        vmFinalStateHash
    };
}
exports.loadTransactionComputePhase = loadTransactionComputePhase;
function storeTransactionComputePhase(src) {
    return (builder) => {
        if (src.type === 'skipped') {
            builder.storeBit(0);
            builder.store((0, ComputeSkipReason_1.storeComputeSkipReason)(src.reason));
            return;
        }
        builder.storeBit(1);
        builder.storeBit(src.success);
        builder.storeBit(src.messageStateUsed);
        builder.storeBit(src.accountActivated);
        builder.storeCoins(src.gasFees);
        builder.storeRef((0, Builder_1.beginCell)()
            .storeVarUint(src.gasUsed, 3)
            .storeVarUint(src.gasLimit, 3)
            .store((b) => (src.gasCredit !== undefined && src.gasCredit !== null) ? b.storeBit(1).storeVarUint(src.gasCredit, 2) : b.storeBit(0))
            .storeUint(src.mode, 8)
            .storeInt(src.exitCode, 32)
            .store((b) => (src.exitArg !== undefined && src.exitArg !== null) ? b.storeBit(1).storeInt(src.exitArg, 32) : b.storeBit(0))
            .storeUint(src.vmSteps, 32)
            .storeUint(src.vmInitStateHash, 256)
            .storeUint(src.vmFinalStateHash, 256)
            .endCell());
    };
}
exports.storeTransactionComputePhase = storeTransactionComputePhase;
