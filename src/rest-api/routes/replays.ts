import { FastifyPluginCallback } from "fastify";
import { AndOperator, FindAndCountOptions, Op, OrOperator, Sequelize, WhereAttributeHash } from "sequelize";
import { Database } from "~/database";
import { DBSchema } from "~/model/db";
import { paginateReplySchema, PaginateReplyType } from "~/model/rest-api/pagination";
import { replaysQuerySchema, ReplaysQueryType } from "~/model/rest-api/replays";
import { PluginOptions } from "~/rest-api";
import { isTuple } from "~/utils/tuple-check";
const { JsonSchema7Strategy } = require('@alt3/sequelize-to-json-schemas');

const plugin: FastifyPluginCallback<PluginOptions> = async function(app, { db, redis, schemaManager }) {
    const userNameIdMap: { [username: string]: number } = {};

    app.route<{ Querystring: ReplaysQueryType; Reply: PaginateReplyType<DBSchema.Demo.Schema> }>({
        method: "GET",
        url: "/replays",
        schema: {
            querystring: replaysQuerySchema,
            response: {
                //200: paginateReplySchema(demoSchema)
            }
        },
        handler: async (request, reply) => {
            const { page, limit, preset, endedNormally, hasBots, date: dateRangeStr, durationRangeMins, maps, players, reported, tsRange } = request.query;

            const demoWhere: WhereAttributeHash<DBSchema.Demo.Schema> | AndOperator<DBSchema.Demo.Schema> | OrOperator<DBSchema.Demo.Schema> = {};
            const mapWhere: WhereAttributeHash<DBSchema.SpringMap.Schema> | AndOperator<DBSchema.SpringMap.Schema> | OrOperator<DBSchema.SpringMap.Schema> = {};

            if (preset !== undefined) {
                demoWhere.preset = preset;
            }

            if (endedNormally !== undefined) {
                demoWhere.gameEndedNormally = endedNormally;
            }

            if (hasBots !== undefined) {
                demoWhere.hasBots = hasBots;
            }

            if (reported !== undefined) {
                demoWhere.reported = reported;
            }

            const dateRange = dateRangeStr?.map(str => new Date(str)).sort((a, b) => a.valueOf() - b.valueOf());
            if (dateRange) {
                if (dateRange?.length === 1) {
                    const sameDay = new Date(dateRange[0].getTime());
                    sameDay.setDate(sameDay.getDate() + 1);
                    dateRange.push(sameDay);
                }
                if (isTuple(dateRange)) {
                    demoWhere.startTime = { [Op.between]: dateRange }
                }
            }

            if (durationRangeMins) {
                const durationRangeMs = durationRangeMins.map(min => min * 1000 * 60)
                if (isTuple(durationRangeMs)) {
                    demoWhere.durationMs = { [Op.between]: durationRangeMs };
                }
            }

            const demoIds: string[][] = [];

            if (tsRange) {
                const tsRangeDemoIds = await getTrueSkillDemoIds(tsRange[0], tsRange[1]);
                demoIds.push(tsRangeDemoIds);
            }

            if (players) {
                const playerDemoIds = await getPlayerDemoIds(players);
                demoIds.push(playerDemoIds);
            }

            if (demoIds.length) {
                demoWhere.id = {
                    [Op.and]: demoIds.map((ids) => { return { [Op.in]: ids }; })
                };
            }

            if (maps) {
                mapWhere.scriptName = { [Op.or]: maps };
            }
            
            const query: FindAndCountOptions<DBSchema.Demo.Schema> = {
                offset: (page - 1) * limit,
                limit,
                attributes: ["id", "startTime", "durationMs"],
                distinct: true,
                where: demoWhere,
                order: [["startTime", "DESC"]],
                include: [
                    {
                        model: db.schema.map,
                        attributes: ["fileName", "scriptName"],
                        where: mapWhere,
                    },
                    {
                        model: db.schema.allyTeam, // TODO: only include total player counts instead of objects
                        attributes: ["winningTeam"],
                        separate: true,
                        include: [
                            {
                                model: db.schema.player,
                                attributes: ["name"],
                                subQuery: false,
                                separate: true,
                            },
                            {
                                model: db.schema.ai,
                                attributes: ["shortName"],
                                subQuery: false,
                                separate: true,
                            }
                        ],
                        required: true,
                    }
                ],
            };

            try {
                const { count: totalResults, rows: data } = await db.schema.demo.findAndCountAll(query);
                return { totalResults, page, limit, data };
            } catch (err) {
                console.log(err);
                throw err;
            }
        }
    });

    async function getTrueSkillDemoIds(trueSkillMin: number, trueSkillMax: number) {
        const foundDemos = await db.schema.demo.findAll({
            attributes: ["id"],
            include: [{
                model: db.schema.allyTeam,
                attributes: [],
                include: [{
                    model: db.schema.player,
                    attributes: []
                }]
            }],
            group: ["Demo.id"],
            having: Sequelize.literal(`COUNT(*) = COUNT(CASE WHEN "AllyTeams->Players"."trueSkill" BETWEEN ${trueSkillMin} AND ${trueSkillMax} THEN 1 END)`)
        });
    
        const foundDemoIds = foundDemos.map(demo => demo.id);
    
        return foundDemoIds;
    }

    async function getPlayerDemoIds(players: string[]) {
        const userIds: number[] = [];
        for (const name of players) {
            const userId = await getPlayerUserId(name);
            if (userId !== undefined) {
                userIds.push(userId);
            }
        }

        const foundDemos = await db.schema.demo.findAll({
            attributes: ["id"],
            include: [{
                model: db.schema.allyTeam,
                attributes: [],
                include: [{
                    model: db.schema.player,
                    attributes: [],
                    right: true,
                    where: {
                        userId: {
                            [Op.in]: userIds
                        }
                    }
                }],
                required: true
            }],
            group: ["Demo.id"],
        });

        const foundDemoIds = foundDemos.map(demo => demo.id);

        return foundDemoIds;
    }

    async function getPlayerUserId(playerName: string) : Promise<number | undefined> {
        const userId = userNameIdMap[playerName];

        if (userId === undefined) {
            const userLookupStr = await redis.get("users");
            if (userLookupStr) {
                const users = JSON.parse(userLookupStr) as Array<{ id: number, username: string, countryCode: string}>;
                for (const user of users) {
                    userNameIdMap[user.username] = user.id;
                }
                return userNameIdMap[playerName];
            }
        }

        return userId;
    }
};

export default plugin;