import fastify, { FastifyInstance } from "fastify";
import { Model, ModelStatic } from "sequelize";

import { BARDBConfig } from "~/bar-db-config";
import { Database } from "~/database";
import { DBSchema } from "~/model/db";
import { MapsReply, mapsReplyDef } from "~/model/rest-api/maps";

export class RestAPI {
    protected config: BARDBConfig;
    protected db: Database;
    protected server!: FastifyInstance;

    constructor(config: BARDBConfig) {
        this.config = config;

        this.config.db.syncModel = false;
        this.config.db.createSchemaDiagram = false;
        this.config.db.initMemoryStore = false;

        this.db = new Database(config.db);
    }

    public async init() {
        await this.db.init();

        this.server = await fastify({
            ignoreTrailingSlash: true,
        });

        // USE https://www.npmjs.com/package/sequelize-json-schema
        this.server.get<{
            Querystring: {
                page: number;
                limit: number;
            };
            Reply: MapsReply
        }>("/maps", {
            schema: {
                querystring: {
                    type: "object",
                    properties: {
                        page: { type: "number", default: 1 },
                        limit: { type: "number", default: 24 },
                    }
                },
                response: {
                    200: mapsReplyDef
                }
            }
        }, async (req, rep) => {
            const { page, limit } = req.query;

            const { count, rows }: { count: number, rows: DBSchema.SpringMap.Schema[] } = await this.db.schema.map.findAndCountAll({
                offset: (page - 1) * limit,
                limit,
                order: [["scriptName", "ASC"]],
                raw: true,
            });

            const response = {
                totalResults: count,
                page,
                limit,
                //filters,
                //sorts: sort,
                data: rows
            };

            rep.status(200).send(response);
        });

        try {
            const address = await this.server.listen(this.config.apiPort);

            console.log(`Server is now listening on ${address}`);
        } catch (err) {
            this.server.log.error(err);
            process.exit(1);
        }
    }
}