import { FastifyPluginCallback } from "fastify";
import { PluginOptions } from "~/rest-api";

const plugin: FastifyPluginCallback<PluginOptions> = async function(app, { db, redis }) {
    app.route({
        method: "GET",
        url: "/cached-users",
        handler: async (request, reply) => {
            const users = await redis.get("users");

            reply.header("Content-Type", "application/json");

            return users;
        },
    });
};

export default plugin;