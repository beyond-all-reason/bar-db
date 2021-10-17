import { SLDBClient, SLDBModel } from "sldbts";
export interface LeaderboardServiceConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    leaderboards: string[];
    pollInterval?: number;
    verbose?: boolean;
}
export declare class LeaderboardService {
    leaderboards: SLDBModel.LeaderboardResult[];
    stuff: string;
    protected config: Required<LeaderboardServiceConfig>;
    protected sldbClient: SLDBClient;
    constructor(config: LeaderboardServiceConfig);
    init(): void;
    protected updateLeaderboards(): Promise<void>;
}
