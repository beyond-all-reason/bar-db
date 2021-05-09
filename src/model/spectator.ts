import { BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, Model, Optional } from "sequelize";

import { UserCreationAttributes, UserInstance } from "./user";

export interface Spectator {
    id: number;
    playerId: number;
    name: string;
    countryCode: string;
    rank: number;
    skill: string;
    skillUncertainty?: number;
}

export interface SpectatorCreationAttributes extends Optional<Spectator, "id"> { }

export interface SpectatorInstance extends Model<Spectator, SpectatorCreationAttributes>, Spectator {
    demoId: string;
    userId: number;

    getUser: BelongsToGetAssociationMixin<UserInstance>;
    setUser: BelongsToSetAssociationMixin<UserInstance, UserInstance["id"]>;
    createUser: (user: UserCreationAttributes) => Promise<UserInstance>;
}