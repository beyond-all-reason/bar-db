import { AllyTeamCreationAttributes, AllyTeamInstance } from "./ally-team";
import { UserCreationAttributes, UserInstance } from "./user";
import { BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, Model, Optional } from "sequelize";

export interface Player {
    id: number;
    playerId: number;
    name: string;
    teamId: number;
    handicap: number;
    faction: string;
    countryCode: string;
    rgbColor: { r: number, g: number, b: number };
    rank: number;
    skillUncertainty: number;
    skill: string;
}

export interface PlayerCreationAttributes extends Optional<Player, "id"> { }

export interface PlayerInstance extends Model<Player, PlayerCreationAttributes>, Player {
    getAllyTeam: BelongsToGetAssociationMixin<AllyTeamInstance>;
    setAllyTeam: BelongsToSetAssociationMixin<AllyTeamInstance, AllyTeamInstance["id"]>;
    createAllyTeam: (allyTeam: AllyTeamCreationAttributes) => Promise<AllyTeamInstance>;

    getUser: BelongsToGetAssociationMixin<UserInstance>;
    setUser: BelongsToSetAssociationMixin<UserInstance, UserInstance["id"]>;
    createUser: (user: UserCreationAttributes) => Promise<UserInstance>;
}