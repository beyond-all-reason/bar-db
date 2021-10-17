"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
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
            const query = {
                offset: (page - 1) * limit,
                limit,
                attributes: ["sha", "date", "message", "url"],
                distinct: true,
                order: [["date", "DESC"]],
                where: {
                    message: {
                        [sequelize_1.Op.notILike]: "Merge pull request%"
                    }
                },
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
                        required: true,
                    }
                ]
            };
            try {
                const { count: totalResults, rows: data } = await db.schema.balanceChange.findAndCountAll(query);
                return { totalResults, page, limit, data };
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        },
    });
};
exports.default = plugin;
//# sourceMappingURL=balance-changes.js.map