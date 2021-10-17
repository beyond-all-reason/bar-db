import { Static } from "@sinclair/typebox";
export declare function coerceObject<T extends any>(data: T, schema: object): Static<typeof schema> | void;
