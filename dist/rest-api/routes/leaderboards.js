"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin = async function (app, { sldbService }) {
    app.route({
        method: "GET",
        url: "/leaderboards",
        handler: async (request, reply) => {
            return sldbService.leaderboards;
        },
    });
};
exports.default = plugin;
//# sourceMappingURL=leaderboards.js.map