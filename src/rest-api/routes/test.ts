import { Type } from "@sinclair/typebox";
import { FastifyPluginCallback } from "fastify";
import { paginateQuerySchema } from "~/model/rest-api/pagination";
import { PluginOptions } from "~/rest-api";

enum Stuff {
    OK = "ok",
    BIRD = "bird",
}

const plugin: FastifyPluginCallback<PluginOptions> = async function(app, { db, redis }) {
    app.route({
        method: "GET",
        url: "/test",
        schema: {
            querystring: paginateQuerySchema(Type.Object({
                fish: Type.Optional(Type.Array(Type.Enum(Stuff))),
            })),
        },
        handler: async (request, reply) => {
            console.log(request.query);
            return { hello: "world"}
        },
    });
};

export default plugin;