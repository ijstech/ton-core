"use strict";
/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TupleReader = void 0;
class TupleReader {
    constructor(items) {
        this.items = [...items];
    }
    get remaining() {
        return this.items.length;
    }
    peek() {
        if (this.items.length === 0) {
            throw Error('EOF');
        }
        return this.items[0];
    }
    pop() {
        if (this.items.length === 0) {
            throw Error('EOF');
        }
        let res = this.items[0];
        this.items.splice(0, 1);
        return res;
    }
    skip(num = 1) {
        for (let i = 0; i < num; i++) {
            this.pop();
        }
        return this;
    }
    readBigNumber() {
        let popped = this.pop();
        if (popped.type !== 'int') {
            throw Error('Not a number');
        }
        return popped.value;
    }
    readBigNumberOpt() {
        let popped = this.pop();
        if (popped.type === 'null') {
            return null;
        }
        if (popped.type !== 'int') {
            throw Error('Not a number');
        }
        return popped.value;
    }
    readNumber() {
        return Number(this.readBigNumber());
    }
    readNumberOpt() {
        let r = this.readBigNumberOpt();
        if (r !== null) {
            return Number(r);
        }
        else {
            return null;
        }
    }
    readBoolean() {
        let res = this.readNumber();
        return res === 0 ? false : true;
    }
    readBooleanOpt() {
        let res = this.readNumberOpt();
        if (res !== null) {
            return res === 0 ? false : true;
        }
        else {
            return null;
        }
    }
    readAddress() {
        let r = this.readCell().beginParse().loadAddress();
        if (r !== null) {
            return r;
        }
        else {
            throw Error('Not an address');
        }
    }
    readAddressOpt() {
        let r = this.readCellOpt();
        if (r !== null) {
            return r.beginParse().loadMaybeAddress();
        }
        else {
            return null;
        }
    }
    readCell() {
        let popped = this.pop();
        if (popped.type !== 'cell' && popped.type !== 'slice' && popped.type !== 'builder') {
            throw Error('Not a cell: ' + popped.type);
        }
        return popped.cell;
    }
    readCellOpt() {
        let popped = this.pop();
        if (popped.type === 'null') {
            return null;
        }
        if (popped.type !== 'cell' && popped.type !== 'slice' && popped.type !== 'builder') {
            throw Error('Not a cell');
        }
        return popped.cell;
    }
    readTuple() {
        let popped = this.pop();
        if (popped.type !== 'tuple') {
            throw Error('Not a tuple');
        }
        return new TupleReader(popped.items);
    }
    readTupleOpt() {
        let popped = this.pop();
        if (popped.type === 'null') {
            return null;
        }
        if (popped.type !== 'tuple') {
            throw Error('Not a tuple');
        }
        return new TupleReader(popped.items);
    }
    static readLispList(reader) {
        const result = [];
        let tail = reader;
        while (tail !== null) {
            var head = tail.pop();
            if (tail.items.length === 0 || (tail.items[0].type !== 'tuple' && tail.items[0].type !== 'null')) {
                throw Error('Lisp list consists only from (any, tuple) elements and ends with null');
            }
            tail = tail.readTupleOpt();
            result.push(head);
        }
        return result;
    }
    readLispListDirect() {
        if (this.items.length === 1 && this.items[0].type === 'null') {
            return [];
        }
        return TupleReader.readLispList(this);
    }
    readLispList() {
        return TupleReader.readLispList(this.readTupleOpt());
    }
    readBuffer() {
        let s = this.readCell().beginParse();
        if (s.remainingRefs !== 0) {
            throw Error('Not a buffer');
        }
        if (s.remainingBits % 8 !== 0) {
            throw Error('Not a buffer');
        }
        return s.loadBuffer(s.remainingBits / 8);
    }
    readBufferOpt() {
        let r = this.readCellOpt();
        if (r !== null) {
            let s = r.beginParse();
            if (s.remainingRefs !== 0 || s.remainingBits % 8 !== 0) {
                throw Error('Not a buffer');
            }
            return s.loadBuffer(s.remainingBits / 8);
        }
        else {
            return null;
        }
    }
    readString() {
        let s = this.readCell().beginParse();
        return s.loadStringTail();
    }
    readStringOpt() {
        let r = this.readCellOpt();
        if (r !== null) {
            let s = r.beginParse();
            return s.loadStringTail();
        }
        else {
            return null;
        }
    }
}
exports.TupleReader = TupleReader;
