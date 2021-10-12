import { Signal } from "jaz-ts-utils";
import * as net from "net";

export interface SpadsInstance {
    host: string;
    port: number;
    socket: net.Socket;
    latestData?: SpadsBattleData;
}

export interface SpadsBattleData {
    battleLobby: {
        clients: SpadsBattleLobbyClient[] | null;
        status: {
            "Game type": string;
            Mod: string;
            Preset: string;
            "Battle status": string;
            Map: string;
            battleStatus: string;
            delaySinceLastGame: number;
        } | null;
    };
    game: {
        clients: SpadsGameClient[] | null;
        status: {
            Mod: string;
            "Game status": string;
            Map: string;
            gameStatus: string;
            gameTime: number;
        } | null;
    };
}

export interface SpadsBattleLobbyClient {
    Rank: string;
    Team?: number;
    Name: string;
    Ready?: string;
    Skill: string;
    ID: string;
    Id?: number;
    Clan?: string;
}

export interface SpadsGameClient {
    Team: number;
    Name: string;
    Ready?: string;
    Id: number;
    Version: string;
    Status?: string;
}

export enum SpadsGameClientStatus {
    Playing = "Playing",
    Spectating = "Spectating",
    NotConnected = "Not connected"
}

export enum SpadsGameClientReady {
    Yes = "Yes",
    No = "No",
    Placed = "Placed",
}