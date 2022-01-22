"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceChangeProcessor = void 0;
const bar_balance_changes_1 = require("bar-balance-changes");
const jaz_ts_utils_1 = require("jaz-ts-utils");
const defaultBalanceChangeFetcherConfig = {
    pollIntervalMs: 1800000,
    errorLoggingFunction: console.error
};
class BalanceChangeProcessor {
    constructor(config, db) {
        this.processedShas = [];
        this.config = Object.assign({}, defaultBalanceChangeFetcherConfig, config);
        this.db = db;
        this.balanceChangeFetcher = new bar_balance_changes_1.BalanceChangeFetcher(this.config);
    }
    async init() {
        const allBalanceChanges = await this.db.schema.balanceChange.findAll({
            attributes: ["sha"],
            raw: true
        });
        this.processedShas = allBalanceChanges.map(change => change.sha);
    }
    async processBalanceChanges() {
        while (true) {
            try {
                console.log("Polling for balance changes...");
                const changes = await this.balanceChangeFetcher.fetchLatestBalanceChanges({
                    excludeShas: this.processedShas,
                    page: 0
                });
                for (const change of changes) {
                    try {
                        if (!this.processedShas.includes(change.sha)) {
                            console.log(`Processing balance change: ${change.sha} - ${change.message}`);
                            await this.saveChange(change);
                            console.log("Balance change processed");
                        }
                    }
                    catch (err) {
                        console.log("Error processing balance change", err);
                    }
                }
            }
            catch (err) {
                console.log("There was an error processing balance changes", err);
            }
            await (0, jaz_ts_utils_1.delay)(this.config.pollIntervalMs);
        }
    }
    async saveChange(commit) {
        var _a;
        const [balanceChangeAuthor] = await this.db.schema.balanceChangeAuthor.findOrCreate({
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
                scav: (_a = change.isScav) !== null && _a !== void 0 ? _a : false
            });
        }
        this.processedShas.push(commit.sha);
    }
}
exports.BalanceChangeProcessor = BalanceChangeProcessor;
//# sourceMappingURL=balance-change-processor.js.map