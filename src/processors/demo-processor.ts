import * as fs from "fs";
import { Signal } from "jaz-ts-utils";
import * as path from "path";
import { DemoModel, DemoParser, isPacket } from "sdfz-demo-parser";
import { SLDBClient, SLDBModel } from "sldbts";

import { Database } from "~/database";
import { DBSchema } from "~/model/db";
import { FileProcessor as FileProcessor, FileProcessorConfig } from "~/processors/file-processor";

export class DemoProcessor extends FileProcessor {
    public onDemoProcessed: Signal<DBSchema.Demo.Instance> = new Signal();

    protected db: Database;
    protected sldbClient: SLDBClient;

    constructor(config: FileProcessorConfig) {
        super(config);

        this.db = config.db;

        this.sldbClient = new SLDBClient(this.config.bardbConfig.sldb);
    }

    protected async processFile(filePath: string) {
        const fileBytes1 = (await fs.promises.stat(filePath)).size;
        const fileMB1 = fileBytes1 / 1048576;
        if (fileMB1 > 20) { // sdfz-demo-parser isn't efficient enough with memory to handle demos larger than 20MB atm
            console.log(`File over ${fileMB1}MB, ignoring and deleting.`);
            return "delete";
        }

        const demoParser = new DemoParser();

        let awards: DBSchema.Demo.Schema["awards"] | undefined;
        demoParser.onPacket.add((packet) => {
            if (isPacket(packet, DemoModel.Packet.ID.LUAMSG) && packet.data.data.name === "AWARDS") {
                awards = packet.data.data.data;
            }
        });

        const demoData = await demoParser.parseDemo(filePath);
        const mapScriptName = demoData.info.hostSettings.mapname;

        let sldbMatchData: SLDBModel.MatchResult | undefined;
        try {
            sldbMatchData = await this.getSLDBMatchData(demoData.header.gameId);
        } catch (err) {
            console.log(err);
            console.log(`Error grabbing match data from SLDB for: ${demoData.header.gameId}`);
        }

        const [ map ] = await this.db.schema.map.findOrCreate({
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
        let preset: string = "duel";
        if (demoData.info.allyTeams.length > 2) {
            preset = "ffa";
        } else if (numOfPlayers > 2) {
            preset = "team";
        } else if (numOfPlayers === 2) {
            preset = "duel";
        }

        if (sldbMatchData?.gameType) {
            preset = sldbMatchData.gameType.toLowerCase();
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
            spadsSettings: demoData.info.spadsSettings,
            gameEndedNormally: demoData.info.meta.winningAllyTeamIds.length > 0,
            chatlog: demoData.chatlog || [],
            preset,
            hasBots: demoData.info.ais.length > 0,
            reported,
            awards
        });

        const allyTeams: { [allyTeamId: number]: DBSchema.AllyTeam.Instance } = {};

        for (const allyTeamData of demoData.info.allyTeams) {
            const allyTeam = await demo.createAllyTeam({
                allyTeamId: allyTeamData.allyTeamId,
                startBox: allyTeamData.startBox!,
                winningTeam: allyTeamData.allyTeamId === demoData.info.meta.winningAllyTeamIds[0]
            });
            allyTeams[allyTeam.allyTeamId] = allyTeam;
        }

        const playerAndSpecs: Array<DemoModel.Info.Player | DemoModel.Info.Spectator> = [...demoData.info.players, ...demoData.info.spectators];
        for (const playerOrSpecData of playerAndSpecs) {
            let user: DBSchema.User.Instance | undefined;

            const sldbTrueSkillData = sldbMatchData?.players.find(player => player.accountId === playerOrSpecData.userId);

            if (playerOrSpecData.userId !== undefined) {
                [ user ] = await this.db.schema.user.findOrCreate({
                    where: { id: playerOrSpecData.userId },
                    defaults: {
                        id: playerOrSpecData.userId,
                        username: playerOrSpecData.name,
                        countryCode: playerOrSpecData.countryCode!,
                        rank: playerOrSpecData.rank,
                        skill: playerOrSpecData.skill,
                        trueSkill: Number(playerOrSpecData.skill) || undefined,
                        skillUncertainty: playerOrSpecData.skillUncertainty,
                    }
                });

                user.username = playerOrSpecData.name;
                user.countryCode = playerOrSpecData.countryCode!;
                user.rank = playerOrSpecData.rank;
                user.skill = playerOrSpecData.skill;
                if (Number(playerOrSpecData.skill)) {
                    user.trueSkill = Number(playerOrSpecData.skill);
                }
                user.skillUncertainty = playerOrSpecData.skillUncertainty;

                if (sldbTrueSkillData) {
                    user.trueSkill = sldbTrueSkillData.skills.after.estimated;
                    user.skillUncertainty = sldbTrueSkillData.skills.after.uncertainty;
                    user.privacyMode = sldbTrueSkillData.privacyMode === 1;
                }

                await user.save();

                const [ alias ] = await user.getAliases({
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
                    countryCode: playerOrSpecData.countryCode!,
                    rgbColor: playerOrSpecData.rgbColor,
                    rank: playerOrSpecData.rank,
                    skillUncertainty: playerOrSpecData.skillUncertainty,
                    skill: playerOrSpecData.skill!,
                    trueSkill: Number(playerOrSpecData.skill) || undefined,
                    startPos: playerOrSpecData.startPos,
                    clanId: playerOrSpecData.clanId,
                    trueSkillMuBefore: sldbTrueSkillData?.skills.before.estimated,
                    trueSkillSigmaBefore: sldbTrueSkillData?.skills.before.uncertainty,
                    trueSkillMuAfter: sldbTrueSkillData?.skills.after.estimated,
                    trueSkillSigmaAfter: sldbTrueSkillData?.skills.after.uncertainty,
                });
                if (user) {
                    await user.addPlayer(player);
                }
            } else {
                const spectator = await demo.createSpectator({
                    playerId: playerOrSpecData.playerId,
                    name: playerOrSpecData.name,
                    countryCode: playerOrSpecData.countryCode!,
                    rank: playerOrSpecData.rank,
                    skillUncertainty: playerOrSpecData.skillUncertainty,
                    skill: playerOrSpecData.skill!
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

    protected async getSLDBMatchData(matchId: string): Promise<SLDBModel.MatchResult> {
        const matchResults = await this.sldbClient.getMatchSkills([matchId]);
        return matchResults[0];
    }

    protected async uploadFileToObjectStorage(filePath: string, prefix: string = "/") {
        return super.uploadFileToObjectStorage(filePath, "/demos");
    }
}