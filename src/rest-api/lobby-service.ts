import * as net from "net";
import { SpringLobbyProtocolClient } from "sluts";
import { Signal } from "jaz-ts-utils";
import Redis from "ioredis";

import { Battle } from "~/model/rest-api/battle";
import { Player } from "~/model/rest-api/player";
import { SpadsBattleData } from "~/model/rest-api/spads";
import { BARDBConfig } from "~/bar-db-config";

export type Battles = { [battleId: number]: Battle<{ [username: string]: Player }> };
export type Players = { [key: string]: Player };

export class LobbyService {
    public config: BARDBConfig["lobby"];
    public lobbyClient: SpringLobbyProtocolClient;
    public onBattleUpdate: Signal = new Signal();
    public onPlayerUpdate: Signal = new Signal();
    public battles: Battles = {};
    public players: Players = {};
    public activeBattles: Battle<Player[]>[] = [];

    protected redis: Redis.Redis;

    constructor(config: BARDBConfig["lobby"], redis: Redis.Redis) {
        this.config = config;
        
        this.redis = redis;

        this.lobbyClient = new SpringLobbyProtocolClient(this.config);

        setInterval(() => this.updateSpadsInfo(), 3000);

        process.on("SIGINT", async() => {
            await this.lobbyClient.disconnect(false);

            process.exit();
        });

        this.onBattleUpdate.add(() => this.updateActiveBattles());
    }

    public async init() {
        try {
            this.lobbyClient.onResponse("ADDUSER").add((data) => {
                this.players[data.userName] = {
                    username: data.userName,
                    userId: data.userId,
                    country: data.country
                };

                this.onPlayerUpdate.dispatch();
            });

            this.lobbyClient.onResponse("REMOVEUSER").add((data) => {
                const player = this.players[data.userName];
                if (player.battleId) {
                    delete this.battles[player.battleId].players[player.username];
                }
                delete this.players[data.userName];

                this.onPlayerUpdate.dispatch();
            });

            this.lobbyClient.onResponse("CLIENTSTATUS").add((data) => {
                const player = this.players[data.userName];
                player.status = data.status;

                this.onPlayerUpdate.dispatch();
            });

            this.lobbyClient.onResponse("BATTLEOPENED").add((data) => {
                this.battles[data.battleId] = {
                    battleId: data.battleId,
                    founder: this.players[data.founder],
                    game: data.gameName,
                    ip: data.ip,
                    port: data.port,
                    locked: false,
                    map: data.map,
                    mapHash: data.mapHash,
                    maxPlayers: data.maxPlayers,
                    passworded: data.passworded,
                    rank: data.rank,
                    title: data.title,
                    players: {},
                    spectators: 0
                };

                const founder = this.players[data.founder];
                if (founder && founder.status && !founder.status.bot) {
                    this.battles[data.battleId].players[founder.username] = founder;
                }

                this.onBattleUpdate.dispatch();
            });

            this.lobbyClient.onResponse("BATTLECLOSED").add((data) => {
                delete this.battles[data.battleId];

                this.onBattleUpdate.dispatch();
            });

            this.lobbyClient.onResponse("UPDATEBATTLEINFO").add((data) => {
                const battle = this.battles[data.battleId];
                battle.locked = data.locked;
                battle.spectators = data.spectatorCount;
                battle.mapHash = data.mapHash;
                battle.map = data.mapName;

                this.onBattleUpdate.dispatch();
            });

            this.lobbyClient.onResponse("JOINEDBATTLE").add((data) => {
                const player = this.players[data.userName];
                const battle = this.battles[data.battleId];

                battle.players[player.username] = player;

                this.onBattleUpdate.dispatch();
            });

            this.lobbyClient.onResponse("LEFTBATTLE").add((data) => {
                const player = this.players[data.userName];
                const battle = this.battles[data.battleId];

                if (player && battle) {
                    delete battle.players[player.username];
                    this.onBattleUpdate.dispatch();
                }
            });

            this.lobbyClient.onDisconnect.add(() => {
                this.battles = {};
                this.players = {};
            });

            await this.lobbyClient.connect();
        } catch (err) {
            console.log(err);
        }
    }

    protected async updateActiveBattles() {
        try {
            const allBattles: Battle[] = Object.values(this.battles).map((battle) => {
                const playersObj = battle.players;
                const playersArr = Object.values(playersObj);
                return {
                    ...battle,
                    players: playersArr
                };
            });

            let activeBattles = allBattles.filter(battle => battle.players.length > 0);
            const mapsStr = await this.redis.get("maps");
            const maps = JSON.parse(mapsStr || "[]") as Array<{ id: string, scriptName: string, fileName: string }>;

            activeBattles.forEach((battle, i) => {
                const fileName = maps?.find(map => map.scriptName === battle.map)?.fileName;
                battle.mapFileName = fileName;
            });

            activeBattles = activeBattles.sort((a, b) => b.players.length - a.players.length);

            const passwordedOrLocked: Battle[] = [];
            activeBattles.forEach((battle, i) => {
                if (battle.passworded || battle.locked) {
                    const battle = activeBattles.splice(i, 1)[0];
                    passwordedOrLocked.unshift(battle);
                }
            });
            activeBattles.push(...passwordedOrLocked);

            this.activeBattles = activeBattles;
        } catch (err) {
            console.log(err);
        }
    }

    protected async updateSpadsInfo() {
        for (const battle of Object.values(this.battles)) {
            try {
                const spadsInfo = await this.getSPADSBattleStatus(battle.ip, battle.port);

                if (!spadsInfo) {
                    continue;
                }
                //battle.spadsInfo = spadsInfo;
    
                if (spadsInfo?.battleLobby?.status) {
                    battle.lobbyStatus = spadsInfo.battleLobby.status.battleStatus;
                    battle.gameType = spadsInfo.battleLobby.status["Game type"];
                    battle.preset = spadsInfo.battleLobby.status.Preset;
                    battle.delaySinceLastGame = spadsInfo.battleLobby.status.delaySinceLastGame;
                }
    
                if (spadsInfo?.game?.status) {
                    battle.gameStatus = spadsInfo.game.status.gameStatus;
                    battle.gameTime = spadsInfo.game.status.gameTime;
                }
    
                if (spadsInfo?.battleLobby?.clients) {
                    for (const client of spadsInfo.battleLobby.clients) {
                        const player = this.players[client.Name];
                        if (player) {
                            player.lobbyReady = client.Ready;
                            player.skill = client.Skill;
                            player.clan = client.Clan;
                            player.teamId = client.Id;
                        }
                    }
                }
    
                if (spadsInfo?.game?.clients) {
                    for (const client of spadsInfo.game.clients) {
                        let clientName = client.Name;
                        let joinedAfterStart = false;
                        if (clientName.charAt(1) === "+") {
                            clientName = clientName.split(" + ")[1];
                            joinedAfterStart = true;
                        }
                        const player = this.players[client.Name];
                        if (player) {
                            player.gameReady = client.Ready;
                            player.gameStatus = client.Status;
                            player.joinedGameAfterStart = joinedAfterStart;
                        }
                    }
                }
            } catch (err) {
                console.error(err);
                console.log("error with spads query");
                continue;
            }
        }
    }

    protected async getSPADSBattleStatus(host: string, port: number) : Promise<SpadsBattleData | undefined> {
        return new Promise(resolve => {
            const socket = new net.Socket();

            let chunk = "";

            socket.on("data", (buffer) => {
                chunk += buffer.toString("utf8");
            });

            socket.on("error", (err) => {
                socket.destroy();
                resolve(undefined);
            });

            socket.on("close", (err) => {
                if (chunk) {
                    const data = JSON.parse(chunk) as SpadsBattleData;
                    resolve(data);
                } else {
                    resolve(undefined);
                }
                socket.destroy();
            });

            socket.on("timeout", () => {
                socket.destroy();
                resolve(undefined);
            });

            socket.on("connect", () => {
                socket.write("getFullStatus");
            });

            socket.connect({
                host,
                port,
            });
        });
    }
}
