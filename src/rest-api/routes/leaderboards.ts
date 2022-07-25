import { FastifyPluginCallback } from "fastify";

import { PluginOptions } from "~/rest-api";

const plugin: FastifyPluginCallback<PluginOptions> = async function(app, { sldbService }) {
    app.route({
        method: "GET",
        url: "/leaderboards",
        handler: async (request, reply) => {
            return sldbService?.leaderboards;
        },
    });
};

export default plugin;