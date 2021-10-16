import { FastifyPluginCallback } from "fastify";
import { PluginOptions } from "~/rest-api";

const plugin: FastifyPluginCallback<PluginOptions> = async function(app, { lobbyService }) {
    app.route({
        method: "GET",
        url: "/battles",
        handler: async (request, reply) => {
            return lobbyService.activeBattles;
        },
    });
};

export default plugin;