import { FastifyPluginCallback } from "fastify";
import { JSONSchema7 } from "json-schema";
import { Database } from "~/database";
import { DBSchema } from "~/model/db";
import { mapParamsSchema, MapParamsType } from "~/model/rest-api/map";
import { PluginOptions } from "~/rest-api";
const { JsonSchema7Strategy } = require('@alt3/sequelize-to-json-schemas');

const plugin: FastifyPluginCallback<PluginOptions> = async function(app, { db, redis, schemaManager }) {
    const mapSchema = schemaManager.generate(db.schema.map, new JsonSchema7Strategy(), {
        excludeAssociations: ["Demos"]
    });

    app.route<{ Params: MapParamsType; Reply: DBSchema.SpringMap.Schema }>({
        method: "GET",
        url: "/maps/:mapId",
        schema: {
            params: mapParamsSchema,
            response: {
                200: mapSchema
            }
        },
        handler: async (request, reply) => {
            const map = await db.schema.map.findByPk(request.params.mapId);

            if (map === null) {
                throw app.httpErrors.notFound(`Map not found`);
            }

            return map;
        }
    });
};

export default plugin;