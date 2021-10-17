import { JSONSchema7 } from "json-schema";
export declare type PaginatedReply<T> = {
    totalResults: number;
    page: number;
    limit: number;
    data: T[];
};
export declare function paginateReplySchema<T extends JSONSchema7>(data: T): JSONSchema7;
