import { BalanceChange, BalanceChangeFetcher } from "bar-balance-changes";
import { Database } from "~/database";
export interface BalanceChangeProcessorConfig {
    owner: string;
    repo: string;
    auth: string;
    pollIntervalMs?: number;
    errorLoggingFunction?: (str: string) => void;
}
export declare class BalanceChangeProcessor {
    protected config: BalanceChangeProcessorConfig;
    protected db: Database;
    protected balanceChangeFetcher: BalanceChangeFetcher;
    protected processedShas: string[];
    constructor(config: BalanceChangeProcessorConfig, db: Database);
    init(): Promise<void>;
    processBalanceChanges(): Promise<void>;
    protected saveChange(commit: BalanceChange): Promise<void>;
}
