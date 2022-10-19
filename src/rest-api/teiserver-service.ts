import axios from "axios";
import { delay } from "jaz-ts-utils";

import { BARDBConfig } from "~/index";

export type Rating = {
    age: number;
    colour: string;
    icon: string;
    name: string;
    rating: number;
}

export class TeiserverService {
    public leaderboards: Record<string, Rating[]> = {};

    protected config: BARDBConfig;

    constructor(config: NonNullable<BARDBConfig>) {
        this.config = config;
    }

    public async init() {
        this.updateLeaderboards();
    }

    protected async updateLeaderboards() {
        while (true) {
            try {
                const leaderboardNames = ["Duel", "Team", "FFA"] as const;

                for (const leaderboardName of leaderboardNames) {
                    const response = await axios.request<{ ratings: Rating[] }>({
                        url: `https://${this.config.lobby.host}/teiserver/api/public/leaderboard/${leaderboardName}`,
                        method: "get",
                        headers: {
                            "User-Agent": "bar-rts.com"
                        },
                        responseType: "json"
                    }).catch(err => {
                        if (err) {
                            console.error(err);
                        }
                    });

                    if (response) {
                        const ratings = response.data.ratings;
                        this.leaderboards[leaderboardName.toLowerCase()] = ratings;
                    }
                }
            } catch (err) {
                console.error(err);
            }

            await delay(60000);
        }
    }
}