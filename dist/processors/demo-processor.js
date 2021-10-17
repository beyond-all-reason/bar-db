"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemoProcessor = void 0;
const fs = __importStar(require("fs"));
const jaz_ts_utils_1 = require("jaz-ts-utils");
const path = __importStar(require("path"));
const sdfz_demo_parser_1 = require("sdfz-demo-parser");
const file_processor_1 = require("~/processors/file-processor");
class DemoProcessor extends file_processor_1.FileProcessor {
    constructor(config) {
        super(config);
        this.onDemoProcessed = new jaz_ts_utils_1.Signal();
        this.db = config.db;
    }
    async processFile(filePath) {
        const fileBytes1 = (await fs.promises.stat(filePath)).size;
        const fileMB1 = fileBytes1 / 1048576;
        if (fileMB1 > 20) { // sdfz-demo-parser isn't efficient enough with memory to handle demos larger than 20MB atm
            console.log(`File over ${fileMB1}MB, ignoring and deleting.`);
            return "delete";
        }
        const demoParser = new sdfz_demo_parser_1.DemoParser();
        const demoData = await demoParser.parseDemo(filePath);
        const mapScriptName = demoData.info.hostSettings.mapname;
        const [map] = await this.db.schema.map.findOrCreate({
            where: { scriptName: mapScriptName },
            defaults: {
                scriptName: mapScriptName
            }
        });
        const demoExisted = await this.db.schema.demo.destroy({
            where: { id: demoData.header.gameId }
        });
        if (demoExisted) {
            console.log("Demo already processed. Deleting and reprocessing...");
        }
        const numOfPlayers = demoData.info.players.length + demoData.info.ais.length;
        let preset = "duel";
        if (demoData.info.allyTeams.length > 2) {
            preset = "ffa";
        }
        else if (numOfPlayers > 2) {
            preset = "team";
        }
        else if (numOfPlayers === 2) {
            preset = "duel";
        }
        let reported = false;
        if (demoData.chatlog && demoData.chatlog.length) {
            for (const line of demoData.chatlog) {
                if (line.message.includes("!report")) {
                    reported = true;
                    break;
                }
            }
        }
        const demo = await map.createDemo({
            id: demoData.info.meta.gameId,
            fileName: path.basename(filePath),
            engineVersion: demoData.info.meta.engine,
            gameVersion: demoData.info.hostSettings.gametype,
            startTime: demoData.info.meta.startTime,
            durationMs: demoData.info.meta.durationMs,
            fullDurationMs: demoData.info.meta.fullDurationMs,
            hostSettings: demoData.info.hostSettings,
            gameSettings: demoData.info.gameSettings,
            mapSettings: demoData.info.mapSettings,
            gameEndedNormally: demoData.info.meta.winningAllyTeamIds.length > 0,
            chatlog: demoData.chatlog || [],
            preset,
            hasBots: demoData.info.ais.length > 0,
            reported
        });
        const allyTeams = {};
        for (const allyTeamData of demoData.info.allyTeams) {
            const allyTeam = await demo.createAllyTeam({
                allyTeamId: allyTeamData.allyTeamId,
                startBox: allyTeamData.startBox,
                winningTeam: allyTeamData.allyTeamId === demoData.info.meta.winningAllyTeamIds[0]
            });
            allyTeams[allyTeam.allyTeamId] = allyTeam;
        }
        const playerAndSpecs = [...demoData.info.players, ...demoData.info.spectators];
        for (const playerOrSpecData of playerAndSpecs) {
            let user;
            if (playerOrSpecData.userId !== undefined) {
                [user] = await this.db.schema.user.findOrCreate({
                    where: { id: playerOrSpecData.userId },
                    defaults: {
                        id: playerOrSpecData.userId,
                        username: playerOrSpecData.name,
                        countryCode: playerOrSpecData.countryCode,
                        rank: playerOrSpecData.rank,
                        skill: playerOrSpecData.skill,
                        trueSkill: Number(playerOrSpecData.skill) || undefined,
                        skillUncertainty: playerOrSpecData.skillUncertainty
                    }
                });
                user.username = playerOrSpecData.name;
                user.countryCode = playerOrSpecData.countryCode;
                user.rank = playerOrSpecData.rank;
                user.skill = playerOrSpecData.skill;
                if (Number(playerOrSpecData.skill)) {
                    user.trueSkill = Number(playerOrSpecData.skill);
                }
                user.skillUncertainty = playerOrSpecData.skillUncertainty;
                await user.save();
                const [alias] = await user.getAliases({
                    where: { alias: playerOrSpecData.name }
                });
                if (!alias) {
                    await user.createAlias({
                        alias: playerOrSpecData.name
                    });
                }
            }
            if ("teamId" in playerOrSpecData) {
                const allyTeam = allyTeams[playerOrSpecData.allyTeamId];
                const player = await allyTeam.createPlayer({
                    playerId: playerOrSpecData.playerId,
                    name: playerOrSpecData.name,
                    teamId: playerOrSpecData.teamId,
                    handicap: playerOrSpecData.handicap,
                    faction: playerOrSpecData.faction,
                    countryCode: playerOrSpecData.countryCode,
                    rgbColor: playerOrSpecData.rgbColor,
                    rank: playerOrSpecData.rank,
                    skillUncertainty: playerOrSpecData.skillUncertainty,
                    skill: playerOrSpecData.skill,
                    trueSkill: Number(playerOrSpecData.skill) || undefined,
                    startPos: playerOrSpecData.startPos
                });
                if (user) {
                    await user.addPlayer(player);
                }
            }
            else {
                const spectator = await demo.createSpectator({
                    playerId: playerOrSpecData.playerId,
                    name: playerOrSpecData.name,
                    countryCode: playerOrSpecData.countryCode,
                    rank: playerOrSpecData.rank,
                    skillUncertainty: playerOrSpecData.skillUncertainty,
                    skill: playerOrSpecData.skill
                });
                if (user) {
                    await user.addSpectator(spectator);
                }
            }
        }
        for (const aiData of demoData.info.ais) {
            const allyTeam = allyTeams[aiData.allyTeamId];
            const ai = await allyTeam.createAI({
                aiId: aiData.aiId,
                name: aiData.name,
                shortName: aiData.shortName,
                host: aiData.host,
                startPos: aiData.startPos,
                faction: aiData.faction,
                rgbColor: aiData.rgbColor,
                handicap: aiData.handicap
            });
        }
        this.onDemoProcessed.dispatch(demo);
    }
    async uploadFileToObjectStorage(filePath, prefix = "/") {
        return super.uploadFileToObjectStorage(filePath, "/demos");
    }
}
exports.DemoProcessor = DemoProcessor;
//# sourceMappingURL=demo-processor.js.map