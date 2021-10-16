import { FastifyPluginCallback } from "fastify";
import { PluginOptions } from "~/rest-api";

const plugin: FastifyPluginCallback<PluginOptions> = async function(app, { db, redis }) {
    app.route({
        method: "GET",
        url: "/cached-maps",
        handler: async (request, reply) => {
            const maps = await redis.get("maps");

            reply.header("Content-Type", "application/json");

            return maps;
        },
    });
};

export default plugin;