import Ajv from "ajv";
import { Static, TObject, TProperties } from "@sinclair/typebox";

const ajv = new Ajv({ coerceTypes: true });

// export function coerceObject<T extends { [key in keyof K]: string | string[] | T }, S extends TObject<C>, C extends TProperties, K extends Static<S>>(data: T, schema: S) : Static<typeof schema> | void {
//     const validate = ajv.compile(schema);
//     if (validate(data)) {
//         return data as Static<typeof schema>;
//     }

//     return;
// }
export function coerceObject<T extends any, S extends TObject<C>, C extends TProperties>(data: T, schema: S) : Static<typeof schema> | void {
    const validate = ajv.compile(schema);
    if (validate(data)) {
        return data as Static<typeof schema>;
    }

    return;
}