import { AllyTeamCreationAttributes, AllyTeamInstance } from "./ally-team";
import { BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, Model, Optional } from "sequelize";

export interface AI {
    id: number;
    aiId: number;
    shortName: string;
    name: string;
    host: boolean;
}

export interface AICreationAttributes extends Optional<AI, "id"> { }

export interface AIInstance extends Model<AI, AICreationAttributes>, AI {
    getAllyTeam: BelongsToGetAssociationMixin<AllyTeamInstance>;
    setAllyTeam: BelongsToSetAssociationMixin<AllyTeamInstance, AllyTeamInstance["id"]>;
    createAllyTeam: (allyTeam: AllyTeamCreationAttributes) => Promise<AllyTeamInstance>;
}