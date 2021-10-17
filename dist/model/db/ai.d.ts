import { BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, Model, ModelAttributes, ModelOptions, Optional } from "sequelize";
import { AllyTeam } from "./ally-team";
export declare namespace AI {
    interface Schema {
        id: number;
        aiId: number;
        shortName: string;
        name: string;
        host: boolean;
        handicap: number;
        faction: string;
        rgbColor: {
            r: number;
            g: number;
            b: number;
        };
        startPos?: {
            x: number;
            y: number;
            z: number;
        };
    }
    interface CreationAttributes extends Optional<Schema, "id"> {
    }
    interface Instance extends Model<Schema, CreationAttributes>, Schema {
        allyTeamId: number;
        getAllyTeam: BelongsToGetAssociationMixin<AllyTeam.Instance>;
        setAllyTeam: BelongsToSetAssociationMixin<AllyTeam.Instance, AllyTeam.Instance["id"]>;
        createAllyTeam: (allyTeam: AllyTeam.CreationAttributes) => Promise<AllyTeam.Instance>;
    }
    const sequelizeDefinition: ModelAttributes<AI.Instance, AI.Schema>;
    const sequelizeOptions: ModelOptions;
}
