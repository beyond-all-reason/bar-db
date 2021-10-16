import { Static, TObject, TProperties, TSchema, Type } from '@sinclair/typebox';

export const paginationQuerySchema = Type.Object({
    page: Type.Number({ default: 1, min: 1,}),
    limit: Type.Number({ default: 24, min: 1, max: 100 }),
});

export type PaginationQueryType = Static<typeof paginationQuerySchema>;

export function paginateQuerySchema<T extends TSchema>(schema: T) {
    return Type.Intersect([paginationQuerySchema, schema]);
}

export function paginateReplySchema<T extends TSchema>(dataSchema: T) {
    const schema = Type.Object({
        totalResults: Type.Number(),
        page: Type.Number(),
        limit: Type.Number(),
        data: Type.Array(dataSchema),
    });

    return schema;
}

export type PaginateReplyType<T> = {
    totalResults: number;
    page: number;
    limit: number;
    data: T[];
};