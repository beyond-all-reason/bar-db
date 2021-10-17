import { PlayerStatus } from "sluts";
export interface Player {
    userId: number;
    username: string;
    country: string;
    status?: PlayerStatus;
    battleId?: number;
    skill?: string;
    lobbyReady?: string;
    gameReady?: string;
    clan?: string;
    teamId?: number;
    gameStatus?: string;
    joinedGameAfterStart?: boolean;
}
