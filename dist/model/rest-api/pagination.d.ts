import { Static, TObject, TSchema } from '@sinclair/typebox';
export declare const paginationQuerySchema: TObject<{
    page: import("@sinclair/typebox").TNumber;
    limit: import("@sinclair/typebox").TNumber;
}>;
export declare type PaginationQueryType = Static<typeof paginationQuerySchema>;
export declare function paginateQuerySchema<T extends TSchema>(schema: T): import("@sinclair/typebox").TIntersect<[TObject<{
    page: import("@sinclair/typebox").TNumber;
    limit: import("@sinclair/typebox").TNumber;
}>, T]>;
export declare function paginateReplySchema<T extends TSchema>(dataSchema: T): TObject<{
    totalResults: import("@sinclair/typebox").TNumber;
    page: import("@sinclair/typebox").TNumber;
    limit: import("@sinclair/typebox").TNumber;
    data: import("@sinclair/typebox").TArray<T>;
}>;
export declare type PaginateReplyType<T> = {
    totalResults: number;
    page: number;
    limit: number;
    data: T[];
};
