import { delay, Optionals } from "jaz-ts-utils";
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

const defaultLeaderboardServiceConfig: Optionals<LeaderboardServiceConfig> = {
    pollInterval: 60000,
    verbose: false
};

export class LeaderboardService {
    public leaderboards: SLDBModel.LeaderboardResult[] = [];
    public stuff = "stuff";

    protected config: Required<LeaderboardServiceConfig>;
    protected sldbClient: SLDBClient;

    constructor(config: LeaderboardServiceConfig) {
        this.config = Object.assign({}, defaultLeaderboardServiceConfig, config) as Required<LeaderboardServiceConfig>;

        this.sldbClient = new SLDBClient({
            host: config.host,
            port: config.port,
            username: config.username,
            password: config.password
        });
    }

    public init() {
        this.updateLeaderboards();
    }

    protected async updateLeaderboards() {
        while (true) {
            this.leaderboards = await this.sldbClient.getLeaderboards("BYAR", this.config.leaderboards as SLDBModel.GameType[]);

            await delay(this.config.pollInterval);
        }
    }
}
