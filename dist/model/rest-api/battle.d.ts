import { Player } from "./player";
export interface Battle<PlayersType extends {
    [username: string]: Player;
} | Player[] = Player[]> {
    battleId: number;
    founder: Player;
    ip: string;
    port: number;
    maxPlayers: number;
    passworded: boolean;
    locked: boolean;
    rank: number;
    map: string;
    mapFileName?: string;
    mapHash: number;
    title: string;
    game: string;
    spectators: number;
    lobbyStatus?: string;
    gameStatus?: string;
    gameType?: string;
    preset?: string;
    delaySinceLastGame?: number;
    gameTime?: number;
    players: PlayersType;
}
