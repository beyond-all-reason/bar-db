import { SpringLobbyProtocolClient, SpringLobbyProtocolClientConfig } from "sluts";
import { Signal } from "jaz-ts-utils";
import Redis from "ioredis";
import { Battle } from "~/model/rest-api/battle";
import { Player } from "~/model/rest-api/player";
import { SpadsBattleData } from "~/model/rest-api/spads";
export interface LobbyServiceConfig extends SpringLobbyProtocolClientConfig {
}
export declare type Battles = {
    [battleId: number]: Battle<{
        [username: string]: Player;
    }>;
};
export declare type Players = {
    [key: string]: Player;
};
export declare class LobbyService {
    config: LobbyServiceConfig;
    lobbyClient: SpringLobbyProtocolClient;
    onBattleUpdate: Signal;
    onPlayerUpdate: Signal;
    battles: Battles;
    players: Players;
    activeBattles: Battle<Player[]>[];
    protected redis: Redis.Redis;
    constructor(config: LobbyServiceConfig);
    init(): Promise<void>;
    protected updateActiveBattles(): Promise<void>;
    protected updateSpadsInfo(): Promise<void>;
    protected getSPADSBattleStatus(host: string, port: number): Promise<SpadsBattleData | undefined>;
}
