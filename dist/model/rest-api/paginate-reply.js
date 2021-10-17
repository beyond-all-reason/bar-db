"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginateReplySchema = void 0;
function paginateReplySchema(data) {
    return {
        type: "object",
        properties: {
            totalResults: {
                type: "integer"
            },
            page: {
                type: "integer"
            },
            limit: {
                type: "integer"
            },
            data: {
                type: "array",
                items: data
            }
        },
        required: ["totalResults", "page", "limit", "data"]
    };
}
exports.paginateReplySchema = paginateReplySchema;
//# sourceMappingURL=paginate-reply.js.map