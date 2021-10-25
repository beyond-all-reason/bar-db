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
exports.LobbyService = void 0;
const net = __importStar(require("net"));
const sluts_1 = require("sluts");
const jaz_ts_utils_1 = require("jaz-ts-utils");
class LobbyService {
    constructor(config, redis) {
        this.onBattleUpdate = new jaz_ts_utils_1.Signal();
        this.onPlayerUpdate = new jaz_ts_utils_1.Signal();
        this.battles = {};
        this.players = {};
        this.activeBattles = [];
        this.config = config;
        this.redis = redis;
        this.lobbyClient = new sluts_1.SpringLobbyProtocolClient(this.config);
        setInterval(() => this.updateSpadsInfo(), 3000);
        process.on("SIGINT", async () => {
            await this.lobbyClient.disconnect(false);
            process.exit();
        });
        this.onBattleUpdate.add(() => this.updateActiveBattles());
    }
    async init() {
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
                if (!player) {
                    return;
                }
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
        }
        catch (err) {
            console.log(err);
        }
    }
    async updateActiveBattles() {
        try {
            const allBattles = Object.values(this.battles).map((battle) => {
                const playersObj = battle.players;
                const playersArr = Object.values(playersObj);
                return {
                    ...battle,
                    players: playersArr
                };
            });
            let activeBattles = allBattles.filter(battle => battle.players.length > 0);
            const mapsStr = await this.redis.get("maps");
            const maps = JSON.parse(mapsStr || "[]");
            activeBattles.forEach((battle, i) => {
                var _a;
                const fileName = (_a = maps === null || maps === void 0 ? void 0 : maps.find(map => map.scriptName === battle.map)) === null || _a === void 0 ? void 0 : _a.fileName;
                battle.mapFileName = fileName;
            });
            activeBattles = activeBattles.sort((a, b) => b.players.length - a.players.length);
            const passwordedOrLocked = [];
            activeBattles.forEach((battle, i) => {
                if (battle.passworded || battle.locked) {
                    const battle = activeBattles.splice(i, 1)[0];
                    passwordedOrLocked.unshift(battle);
                }
            });
            activeBattles.push(...passwordedOrLocked);
            this.activeBattles = activeBattles;
        }
        catch (err) {
            console.log(err);
        }
    }
    async updateSpadsInfo() {
        var _a, _b, _c, _d;
        for (const battle of Object.values(this.battles)) {
            try {
                const spadsInfo = await this.getSPADSBattleStatus(battle.ip, battle.port);
                if (!spadsInfo) {
                    continue;
                }
                //battle.spadsInfo = spadsInfo;
                if ((_a = spadsInfo === null || spadsInfo === void 0 ? void 0 : spadsInfo.battleLobby) === null || _a === void 0 ? void 0 : _a.status) {
                    battle.lobbyStatus = spadsInfo.battleLobby.status.battleStatus;
                    battle.gameType = spadsInfo.battleLobby.status["Game type"];
                    battle.preset = spadsInfo.battleLobby.status.Preset;
                    battle.delaySinceLastGame = spadsInfo.battleLobby.status.delaySinceLastGame;
                }
                if ((_b = spadsInfo === null || spadsInfo === void 0 ? void 0 : spadsInfo.game) === null || _b === void 0 ? void 0 : _b.status) {
                    battle.gameStatus = spadsInfo.game.status.gameStatus;
                    battle.gameTime = spadsInfo.game.status.gameTime;
                }
                if ((_c = spadsInfo === null || spadsInfo === void 0 ? void 0 : spadsInfo.battleLobby) === null || _c === void 0 ? void 0 : _c.clients) {
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
                if ((_d = spadsInfo === null || spadsInfo === void 0 ? void 0 : spadsInfo.game) === null || _d === void 0 ? void 0 : _d.clients) {
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
            }
            catch (err) {
                console.error(err);
                console.log("error with spads query");
                continue;
            }
        }
    }
    async getSPADSBattleStatus(host, port) {
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
                    const data = JSON.parse(chunk);
                    resolve(data);
                }
                else {
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
exports.LobbyService = LobbyService;
//# sourceMappingURL=lobby-service.js.map