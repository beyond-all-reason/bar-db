"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("sequelize/types");
const pagination_1 = require("~/model/rest-api/pagination");
const plugin = async function (app, { db }) {
    app.route({
        method: "GET",
        url: "/balance-changes",
        schema: {
            querystring: pagination_1.paginationQuerySchema,
            response: {
            //200: paginateReplySchema(mapSchema)
            }
        },
        handler: async (request, reply) => {
            const { page, limit } = request.query;
            const { count: totalResults, rows: data } = await db.schema.balanceChange.findAndCountAll({
                attributes: ["sha", "date", "message", "url"],
                distinct: true,
                where: {
                    message: {
                        [types_1.Op.notILike]: "Merge pull request%"
                    }
                },
                order: [["date", "DESC"]],
                offset: (page - 1) * limit,
                limit,
                include: [
                    {
                        model: db.schema.balanceChangeAuthor,
                        attributes: ["name", "img", "url"],
                        as: "author",
                        required: true
                    },
                    {
                        model: db.schema.balanceChangeUnitDef,
                        attributes: [["changes", "unit"]],
                        as: "changes",
                        where: {
                            scav: false
                        },
                        required: true
                    }
                ]
            });
            return { totalResults, page, limit, data };
        },
    });
};
exports.default = plugin;
//# sourceMappingURL=balance-changes.js.map