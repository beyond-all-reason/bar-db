import { Static, TObject, TProperties } from "@sinclair/typebox";
export declare function paginateReply<T extends TProperties>(data: TObject<T>): TObject<{
    totalResults: import("@sinclair/typebox").TNumber;
    page: import("@sinclair/typebox").TNumber;
    limit: import("@sinclair/typebox").TNumber;
    data: TObject<T>;
}>;
export declare type PaginatedReplyType = Static<ReturnType<typeof paginateReply>>;
