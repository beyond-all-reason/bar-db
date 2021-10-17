"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const replay_1 = require("~/model/rest-api/replay");
const { JsonSchema7Strategy } = require('@alt3/sequelize-to-json-schemas');
const plugin = async function (app, { db, redis, schemaManager }) {
    // const replayResponseSchema = schemaManager.generate(db.schema.demo, new JsonSchema7Strategy(), {
    // });
    app.route({
        method: "GET",
        url: "/replays/:replayId",
        schema: {
            params: replay_1.replayParamsSchema,
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
exports.default = plugin;
//# sourceMappingURL=replay.js.map