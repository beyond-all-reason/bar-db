"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginateReply = void 0;
const typebox_1 = require("@sinclair/typebox");
function paginateReply(data) {
    return typebox_1.Type.Object({
        totalResults: typebox_1.Type.Number(),
        page: typebox_1.Type.Number({ default: 1 }),
        limit: typebox_1.Type.Number({ default: 24 }),
        data: data
    });
}
exports.paginateReply = paginateReply;
//# sourceMappingURL=paginated-reply.js.map