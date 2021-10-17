"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginateReplySchema = exports.paginateQuerySchema = exports.paginationQuerySchema = void 0;
const typebox_1 = require("@sinclair/typebox");
exports.paginationQuerySchema = typebox_1.Type.Object({
    page: typebox_1.Type.Number({ default: 1, min: 1, }),
    limit: typebox_1.Type.Number({ default: 24, min: 1, max: 100 }),
});
function paginateQuerySchema(schema) {
    return typebox_1.Type.Intersect([exports.paginationQuerySchema, schema]);
}
exports.paginateQuerySchema = paginateQuerySchema;
function paginateReplySchema(dataSchema) {
    const schema = typebox_1.Type.Object({
        totalResults: typebox_1.Type.Number(),
        page: typebox_1.Type.Number(),
        limit: typebox_1.Type.Number(),
        data: typebox_1.Type.Array(dataSchema),
    });
    return schema;
}
exports.paginateReplySchema = paginateReplySchema;
//# sourceMappingURL=pagination.js.map