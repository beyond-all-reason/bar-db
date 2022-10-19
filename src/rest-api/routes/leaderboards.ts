import { FastifyPluginCallback } from "fastify";

import { PluginOptions } from "~/rest-api";

const plugin: FastifyPluginCallback<PluginOptions> = async function(app, { teiserverService }) {
    app.route({
        method: "GET",
        url: "/leaderboards",
        handler: async (request, reply) => {
            return teiserverService?.leaderboards;
        },
    });
};

export default plugin;