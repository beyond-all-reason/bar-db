"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTuple = void 0;
function isTuple(arr) {
    return Array.isArray(arr) && arr.length === 2 && arr[0] !== undefined && arr[1] !== undefined;
}
exports.isTuple = isTuple;
//# sourceMappingURL=tuple-check.js.map