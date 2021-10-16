import { FastifyPluginCallback } from "fastify";
import { JSONSchema7 } from "json-schema";
import { Database } from "~/database";
import { DBSchema } from "~/model/db";
import { paginateReplySchema, PaginateReplyType, paginationQuerySchema, PaginationQueryType } from "~/model/rest-api/pagination";
import { PluginOptions } from "~/rest-api";
const { JsonSchema7Strategy } = require('@alt3/sequelize-to-json-schemas');

const plugin: FastifyPluginCallback<PluginOptions> = async function(app, { db, redis, schemaManager }) {
    const mapSchema = schemaManager.generate(db.schema.map, new JsonSchema7Strategy(), {
        excludeAssociations: ["Demos"]
    });

    app.route<{ Querystring: PaginationQueryType; Reply: PaginateReplyType<DBSchema.SpringMap.Schema> }>({
        method: "GET",
        url: "/maps",
        schema: {
            querystring: paginationQuerySchema,
            response: {
                200: paginateReplySchema(mapSchema)
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

export default plugin;