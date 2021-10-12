import { BalanceChange, BalanceChangeFetcher } from "bar-balance-changes";
import { delay, Optionals } from "jaz-ts-utils";

import { Database } from "~/database";

export interface BalanceChangeProcessorConfig {
    owner: string;
    repo: string;
    auth: string;
    pollIntervalMs?: number;
    errorLoggingFunction?: (str: string) => void;
}

const defaultBalanceChangeFetcherConfig: Optionals<BalanceChangeProcessorConfig> = {
    pollIntervalMs: 1800000,
    errorLoggingFunction: console.error
};

export class BalanceChangeProcessor {
    protected config: BalanceChangeProcessorConfig;
    protected db: Database;
    protected balanceChangeFetcher: BalanceChangeFetcher;
    protected processedShas: string[] = [];

    constructor(config: BalanceChangeProcessorConfig, db: Database) {
        this.config = Object.assign({}, defaultBalanceChangeFetcherConfig, config);

        this.db = db;

        this.balanceChangeFetcher = new BalanceChangeFetcher(this.config);
    }

    async init() {
        const allBalanceChanges = await this.db.schema.balanceChange.findAll({
            attributes: ["sha"],
            raw: true
        });

        this.processedShas = allBalanceChanges.map(change => change.sha);
    }

    public async processBalanceChanges() {
        while (true) {
            try {
                console.log("Polling for balance changes...");

                const changes = await this.balanceChangeFetcher.fetchLatestBalanceChanges({
                    excludeShas: this.processedShas,
                    page: 10
                });
                
                for (const change of changes) {
                    if (!this.processedShas.includes(change.sha)) {
                        console.log(`Processing balance change: ${change.sha} - ${change.message}`);
                        await this.saveChange(change);
                        console.log("Balance change processed");
                    }
                }
            } catch (err) {
                //this.config.errorLoggingFunction!(err);
                console.error(err);
                console.log("There was an error processing balance changes");
            }

            await delay(this.config.pollIntervalMs!);
        }
    }

    protected async saveChange(commit: BalanceChange) {
        const [ balanceChangeAuthor ] = await this.db.schema.balanceChangeAuthor.findOrCreate({
            where: { name: commit.author.name },
            defaults: {
                name: commit.author.name,
                img: commit.author.avatarUrl,
                url: commit.author.profileLink
            }
        });

        const balanceChange = await balanceChangeAuthor.createBalanceChange({
            sha: commit.sha,
            date: commit.date,
            url: commit.url,
            message: commit.message,
        });

        for (const change of commit.changes) {
            const unitDefChange = await balanceChange.createChange({
                unitDefId: change.propertyId,
                changes: change,
                scav: change.isScav ?? false
            });
        }

        this.processedShas.push(commit.sha);
    }
}