"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typebox_1 = require("@sinclair/typebox");
const pagination_1 = require("~/model/rest-api/pagination");
var Stuff;
(function (Stuff) {
    Stuff["OK"] = "ok";
    Stuff["BIRD"] = "bird";
})(Stuff || (Stuff = {}));
const plugin = async function (app, { db, redis }) {
    app.route({
        method: "GET",
        url: "/test",
        schema: {
            querystring: pagination_1.paginateQuerySchema(typebox_1.Type.Object({
                fish: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.Enum(Stuff))),
            })),
        },
        handler: async (request, reply) => {
            console.log(request.query);
            return { hello: "world" };
        },
    });
};
exports.default = plugin;
//# sourceMappingURL=test.js.map