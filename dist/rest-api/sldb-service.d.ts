import { SLDBClient, SLDBModel } from "sldbts";
import { BARDBConfig } from "../bar-db-config";
export declare class SLDBService {
    leaderboards: SLDBModel.LeaderboardResult[];
    protected config: BARDBConfig["sldb"];
    protected sldbClient: SLDBClient;
    constructor(config: BARDBConfig["sldb"]);
    init(): Promise<void>;
    protected updateLeaderboards(): Promise<void>;
}
