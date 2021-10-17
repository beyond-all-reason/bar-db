"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin = async function (app, { db, redis }) {
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
exports.default = plugin;
//# sourceMappingURL=cached-maps.js.map