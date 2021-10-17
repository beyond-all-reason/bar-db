"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.coerceObject = void 0;
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({ coerceTypes: true });
// export function coerceObject<T extends { [key in keyof K]: string | string[] | T }, S extends TObject<C>, C extends TProperties, K extends Static<S>>(data: T, schema: S) : Static<typeof schema> | void {
//     const validate = ajv.compile(schema);
//     if (validate(data)) {
//         return data as Static<typeof schema>;
//     }
//     return;
// }
function coerceObject(data, schema) {
    const validate = ajv.compile(schema);
    if (validate(data)) {
        return data;
    }
    return;
}
exports.coerceObject = coerceObject;
//# sourceMappingURL=coerce-object.js.map