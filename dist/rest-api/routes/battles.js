"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin = async function (app, { lobbyService }) {
    app.route({
        method: "GET",
        url: "/battles",
        handler: async (request, reply) => {
            return lobbyService.activeBattles;
        },
    });
};
exports.default = plugin;
//# sourceMappingURL=battles.js.map