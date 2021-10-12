import { TObject, TProperties, Type } from "@sinclair/typebox";

export function paginateReply<T extends TProperties>(data: TObject<T>) {
    return Type.Object({
        totalResults: Type.Number(),
        page: Type.Number({ default: 1 }),
        limit: Type.Number({ default: 24 }),
        data: Type.Array(data)
    });
}