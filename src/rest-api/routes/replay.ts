import { FastifyPluginCallback } from "fastify";
import { JSONSchema7 } from "json-schema";
import { Database } from "~/database";
import { DBSchema } from "~/model/db";
import { mapParamsSchema, MapParamsType } from "~/model/rest-api/map";
import { replayParamsSchema, ReplayParamsType } from "~/model/rest-api/replay";
import { PluginOptions } from "~/rest-api";
const { JsonSchema7Strategy } = require('@alt3/sequelize-to-json-schemas');

const plugin: FastifyPluginCallback<PluginOptions> = async function(app, { db, redis, schemaManager }) {
    // const replayResponseSchema = schemaManager.generate(db.schema.demo, new JsonSchema7Strategy(), {
    // });

    app.route<{ Params: ReplayParamsType; Reply: DBSchema.Demo.Schema }>({
        method: "GET",
        url: "/replays/:replayId", 
        schema: {
            params: replayParamsSchema,
            response: {
                //200: replayResponseSchema
            }
        },
        handler: async (request, reply) => {
            const { replayId } = request.params;

            const replay = await db.schema.demo.findByPk(replayId, {
                include: [
                    {
                        model: db.schema.map,
                        attributes: ["id", "scriptName", "fileName"],
                        subQuery: false
                    },
                    {
                        model: db.schema.allyTeam,
                        include: [db.schema.player, db.schema.ai],
                        separate: true,
                        order: [["allyTeamId", "ASC"]],
                        subQuery: false,
                    },
                    {
                        model: db.schema.spectator,
                        subQuery: false,
                        separate: true,
                    }
                ]
            });

            if (replay === null) {
                throw app.httpErrors.notFound(`Replay not found`);
            }

            return replay;
        }
    });
};

export default plugin;