import { DBSchema } from "~/model/db";
import { PaginatedReply } from "~/rest-api/pagination";
export declare type MapsReply = PaginatedReply<DBSchema.SpringMap.Schema>;
