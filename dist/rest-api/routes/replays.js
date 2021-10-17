"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const replays_1 = require("../../model/rest-api/replays");
const tuple_check_1 = require("../../utils/tuple-check");
const { JsonSchema7Strategy } = require('@alt3/sequelize-to-json-schemas');
const plugin = async function (app, { db, redis, schemaManager }) {
    const userNameIdMap = {};
    app.route({
        method: "GET",
        url: "/replays",
        schema: {
            querystring: replays_1.replaysQuerySchema,
            response: {
            //200: paginateReplySchema(demoSchema)
            }
        },
        handler: async (request, reply) => {
            const { page, limit, preset, endedNormally, hasBots, date: dateRangeStr, durationRangeMins, maps, players, reported, tsRange } = request.query;
            console.log(request.query);
            const demoWhere = {};
            const mapWhere = {};
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
            const dateRange = dateRangeStr === null || dateRangeStr === void 0 ? void 0 : dateRangeStr.map(str => new Date(str)).sort((a, b) => a.valueOf() - b.valueOf());
            if (dateRange) {
                if ((dateRange === null || dateRange === void 0 ? void 0 : dateRange.length) === 1) {
                    const sameDay = new Date(dateRange[0].getTime());
                    sameDay.setDate(sameDay.getDate() + 1);
                    dateRange.push(sameDay);
                }
                if ((0, tuple_check_1.isTuple)(dateRange)) {
                    demoWhere.startTime = { [sequelize_1.Op.between]: dateRange };
                }
            }
            if (durationRangeMins) {
                const durationRangeMs = durationRangeMins.map(min => min * 1000 * 60);
                if ((0, tuple_check_1.isTuple)(durationRangeMs)) {
                    demoWhere.durationMs = { [sequelize_1.Op.between]: durationRangeMs };
                }
            }
            const demoIds = [];
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
                    [sequelize_1.Op.and]: demoIds.map((ids) => { return { [sequelize_1.Op.in]: ids }; })
                };
            }
            if (maps) {
                mapWhere.scriptName = { [sequelize_1.Op.or]: maps };
            }
            const query = {
                offset: (page - 1) * limit,
                limit,
                attributes: ["id", "startTime", "durationMs"],
                distinct: true,
                where: demoWhere,
                include: [
                    {
                        model: db.schema.map,
                        attributes: ["fileName", "scriptName"],
                        where: mapWhere,
                        //subQuery: true
                    },
                    {
                        model: db.schema.allyTeam,
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
                        //subQuery: false
                    }
                ],
            };
            try {
                const { count: totalResults, rows: data } = await db.schema.demo.findAndCountAll(query);
                return { totalResults, page, limit, data };
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        }
    });
    async function getTrueSkillDemoIds(trueSkillMin, trueSkillMax) {
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
            having: sequelize_1.Sequelize.literal(`COUNT(*) = COUNT(CASE WHEN "AllyTeams->Players"."trueSkill" BETWEEN ${trueSkillMin} AND ${trueSkillMax} THEN 1 END)`)
        });
        const foundDemoIds = foundDemos.map(demo => demo.id);
        return foundDemoIds;
    }
    async function getPlayerDemoIds(players) {
        const userIds = [];
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
                                    [sequelize_1.Op.in]: userIds
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
    async function getPlayerUserId(playerName) {
        const userId = userNameIdMap[playerName];
        if (userId === undefined) {
            const userLookupStr = await redis.get("users");
            if (userLookupStr) {
                const users = JSON.parse(userLookupStr);
                for (const user of users) {
                    userNameIdMap[user.username] = user.id;
                }
                return userNameIdMap[playerName];
            }
        }
        return userId;
    }
};
exports.default = plugin;
//# sourceMappingURL=replays.js.map