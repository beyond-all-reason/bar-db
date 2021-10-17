"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const map_1 = require("~/model/rest-api/map");
const { JsonSchema7Strategy } = require('@alt3/sequelize-to-json-schemas');
const plugin = async function (app, { db, redis, schemaManager }) {
    const mapSchema = schemaManager.generate(db.schema.map, new JsonSchema7Strategy(), {
        excludeAssociations: ["Demos"]
    });
    app.get("/maps/:mapId", {
        schema: {
            params: map_1.mapParamsSchema,
            response: {
                200: mapSchema
            }
        }
    }, async (request, reply) => {
        const map = await db.schema.map.findByPk(request.params.mapId);
        if (map === null) {
            throw app.httpErrors.notFound(`Map not found`);
        }
        return map;
    });
};
exports.default = plugin;
//# sourceMappingURL=map%20copy.js.map