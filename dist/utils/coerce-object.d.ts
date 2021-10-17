import { Static, TObject, TProperties } from "@sinclair/typebox";
export declare function coerceObject<T extends any, S extends TObject<C>, C extends TProperties>(data: T, schema: S): Static<typeof schema> | void;
