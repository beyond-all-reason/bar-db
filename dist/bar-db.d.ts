import { BARDBConfig } from "./bar-db-config";
import { Database } from "./database";
import { MemoryStore } from "./memory-store";
import { BalanceChangeProcessor } from "./processors/balance-change-processor";
import { MapProcessor } from "./processors/map-processor";
import { DemoProcessor } from "./processors/demo-processor";
export declare class BARDB {
    protected config: BARDBConfig;
    protected db: Database;
    protected mapProcessor: MapProcessor;
    protected demoProcessor: DemoProcessor;
    protected balanceChangeProcessor: BalanceChangeProcessor;
    protected memoryStore?: MemoryStore;
    constructor(config: BARDBConfig);
    init(): Promise<void>;
}
