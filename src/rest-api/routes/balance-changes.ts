import { FastifyPluginCallback } from "fastify";
import { FindAndCountOptions, Op } from "sequelize";
import { DBSchema } from "~/model/db";
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

            const query: FindAndCountOptions<DBSchema.BalanceChange.Schema> = {
                offset: (page - 1) * limit,
                limit,
                attributes: ["sha", "date", "message", "url"],
                distinct: true,
                order: [["date", "DESC"]],
                where: {
                    message: {
                        [Op.notILike]: "Merge pull request%"
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
            } catch (err) {
                console.log(err);
                throw err;
            }
        },
    });
};

export default plugin;