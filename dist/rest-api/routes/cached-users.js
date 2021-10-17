"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin = async function (app, { db, redis }) {
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
exports.default = plugin;
//# sourceMappingURL=cached-users.js.map