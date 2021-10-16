import { FastifyPluginCallback } from "fastify";
import { Op } from "sequelize";
import { paginationQuerySchema, PaginationQueryType } from "~/model/rest-api/pagination";
import { PluginOptions } from "~/rest-api";

const plugin: FastifyPluginCallback<PluginOptions> = async function(app, { db }) {
    app.route<{ Querystring: PaginationQueryType; }>({
        method: "GET",
        url: "/balance-changes",
        schema: {
            querystring: paginationQuerySchema,
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
                        [Op.notILike]: "Merge pull request%"
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

export default plugin;