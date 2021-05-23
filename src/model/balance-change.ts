import { Optional, Model } from "sequelize/types";

export interface BalanceChange {
    id: number;
    
}

export interface BalanceChangeCreationAttributes extends Optional<BalanceChange, "id"> { }

export interface BalanceChangeInstance extends Model<BalanceChange, BalanceChangeCreationAttributes>, BalanceChange {
}