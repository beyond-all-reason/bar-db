import * as path from "path";
import { DemoModel, DemoParser } from "sdfz-demo-parser";

import { Database } from "./database";
import { FileProcessor as FileProcessor, FileProcessorConfig } from "./file-processor";

export class DemoProcessor extends FileProcessor {
    protected demoParser: DemoParser;
    protected db: Database;

    constructor(config: FileProcessorConfig) {
        super(config);

        this.demoParser = new DemoParser();
        this.db = config.db;
    }

    protected async processFile(filePath: string) {
        const demoData = await this.demoParser.parseDemo(filePath);
        const mapScriptName = demoData.script.hostSettings.mapname;

        const [ map ] = await this.db.schema.map.findOrCreate({
            where: { scriptName: mapScriptName },
            defaults: {
                scriptName: mapScriptName
            }
        });

        const demoExisted = await this.db.schema.demo.destroy({
            where: { id: demoData.header.gameId }
        });

        if (demoExisted && this.config.verbose) {
            console.log("Demo already processed. Deleting and reprocessing...");
        }

        const demo = await map.createDemo({
            id: demoData.header.gameId,
            fileName: path.basename(filePath),
            engineVersion: demoData.header.versionString,
            gameVersion: demoData.script.hostSettings.gametype,
            startTime: demoData.header.startTime,
            durationMs: demoData.header.gameTime * 1000,
            fullDurationMs: demoData.header.wallclockTime * 1000,
            hostSettings: demoData.script.hostSettings,
            gameSettings: demoData.script.gameSettings,
            mapSettings: demoData.script.mapSettings,
            gameEndedNormally: demoData.statistics.winningAllyTeamIds.length > 0
        });

        for (const allyTeamData of demoData.script.allyTeams) {
            const allyTeam = await demo.createAllyTeam({
                allyTeamId: allyTeamData.id,
                startBox: allyTeamData.startBox,
                winningTeam: allyTeamData.id === demoData.statistics.winningAllyTeamIds[0]
            });

            for (const teamData of allyTeamData.teams) {
                for (const playerData of teamData.players) {
                    if (this.isAI(playerData)) {
                        const ai = await allyTeam.createAI({
                            aiId: playerData.id,
                            name: playerData.name,
                            shortName: playerData.shortName,
                            host: playerData.host,
                            startPos: playerData.startPos,
                            faction: teamData.side,
                            rgbColor: { r: teamData.rgbColor[0], g: teamData.rgbColor[1], b: teamData.rgbColor[2] },
                            handicap: teamData.handicap
                        });
                    } else {
                        const player = await allyTeam.createPlayer({
                            playerId: playerData.id,
                            name: playerData.name,
                            teamId: teamData.id,
                            handicap: teamData.handicap,
                            faction: teamData.side,
                            countryCode: playerData.countryCode,
                            rgbColor: { r: teamData.rgbColor[0], g: teamData.rgbColor[1], b: teamData.rgbColor[2] },
                            rank: playerData.rank,
                            skillUncertainty: playerData.skillUncertainty,
                            skill: playerData.skill,
                            startPos: playerData.startPos
                        });

                        const [ user ] = await this.db.schema.user.findOrCreate({
                            where: { id: playerData.userId },
                            defaults: {
                                id: playerData.userId,
                                username: playerData.name,
                                countryCode: playerData.countryCode,
                                rank: playerData.rank,
                                skill: playerData.skill,
                                skillUncertainty: playerData.skillUncertainty
                            }
                        });

                        if (user.username !== playerData.name) {
                            user.username = playerData.name;
                            await user.save();
                        }

                        const [ alias ] = await user.getAliases({
                            where: { alias: playerData.name }
                        });

                        if (!alias) {
                            await user.createAlias({
                                alias: playerData.name
                            });
                        }

                        await user.addPlayer(player);
                    }
                }
            }
        }

        for (const spectatorData of demoData.script.spectators) {
            const spectator = await demo.createSpectator({
                playerId: spectatorData.id,
                name: spectatorData.name,
                countryCode: spectatorData.countryCode,
                rank: spectatorData.rank,
                skillUncertainty: spectatorData.skillUncertainty,
                skill: spectatorData.skill
            });

            const [ user ] = await this.db.schema.user.findOrCreate({
                where: { id: spectatorData.userId },
                defaults: {
                    id: spectatorData.userId,
                    username: spectatorData.name,
                    countryCode: spectatorData.countryCode,
                    rank: spectatorData.rank,
                    skill: spectatorData.skill,
                    skillUncertainty: spectatorData.skillUncertainty
                }
            });

            await user.addSpectator(spectator);
        }

        return;
    }

    protected isAI(playerOrAI: DemoModel.Script.AI | DemoModel.Script.Player) : playerOrAI is DemoModel.Script.AI {
        return (playerOrAI as DemoModel.Script.AI).shortName !== undefined;
    }
}