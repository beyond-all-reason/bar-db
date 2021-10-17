"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pagination_1 = require("~/model/rest-api/pagination");
const { JsonSchema7Strategy } = require('@alt3/sequelize-to-json-schemas');
const plugin = async function (app, { db, redis, schemaManager }) {
    const mapSchema = schemaManager.generate(db.schema.map, new JsonSchema7Strategy(), {
        excludeAssociations: ["Demos"]
    });
    app.route({
        method: "GET",
        url: "/maps",
        schema: {
            querystring: pagination_1.paginationQuerySchema,
            response: {
                200: pagination_1.paginateReplySchema(mapSchema)
            }
        },
        handler: async (request, reply) => {
            const { page, limit } = request.query;
            const { count: totalResults, rows: data } = await db.schema.map.findAndCountAll({
                offset: (page - 1) * limit,
                limit,
                order: [["scriptName", "ASC"]],
            });
            return { totalResults, page, limit, data };
        }
    });
};
exports.default = plugin;
//# sourceMappingURL=maps.js.map