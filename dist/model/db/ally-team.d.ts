import { BelongsToGetAssociationMixin, BelongsToSetAssociationMixin, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, Model, ModelAttributes, ModelOptions, Optional } from "sequelize";
import { AI } from "./ai";
import { Demo } from "./demo";
import { Player } from "./player";
export declare namespace AllyTeam {
    interface Schema {
        id: number;
        allyTeamId: number;
        startBox: {
            top: number;
            bottom: number;
            left: number;
            right: number;
        };
        winningTeam: boolean;
    }
    interface CreationAttributes extends Optional<Schema, "id"> {
    }
    interface Instance extends Model<Schema, CreationAttributes>, Schema {
        demoId: string;
        getDemo: BelongsToGetAssociationMixin<Demo.Instance>;
        setDemo: BelongsToSetAssociationMixin<Demo.Instance, Demo.Instance["id"]>;
        createDemo: (demo: Demo.CreationAttributes) => Promise<Demo.Instance>;
        getPlayers: HasManyGetAssociationsMixin<Player.Instance>;
        setPlayers: HasManySetAssociationsMixin<Player.Instance, Player.Instance["id"]>;
        addPlayers: HasManyAddAssociationsMixin<Player.Instance, Player.Instance["id"]>;
        addPlayer: HasManyAddAssociationMixin<Player.Instance, Player.Instance["id"]>;
        createPlayer: (player: Player.CreationAttributes) => Promise<Player.Instance>;
        removePlayer: HasManyRemoveAssociationMixin<Player.Instance, Player.Instance["id"]>;
        removePlayers: HasManyRemoveAssociationsMixin<Player.Instance, Player.Instance["id"]>;
        hasPlayer: HasManyHasAssociationMixin<Player.Instance, Player.Instance["id"]>;
        hasPlayers: HasManyHasAssociationsMixin<Player.Instance, Player.Instance["id"]>;
        countPlayers: HasManyCountAssociationsMixin;
        getAIs: HasManyGetAssociationsMixin<AI.Instance>;
        setAIs: HasManySetAssociationsMixin<AI.Instance, AI.Instance["id"]>;
        addAIs: HasManyAddAssociationsMixin<AI.Instance, AI.Instance["id"]>;
        addAI: HasManyAddAssociationMixin<AI.Instance, AI.Instance["id"]>;
        createAI: (ai: AI.CreationAttributes) => Promise<AI.Instance>;
        removeAI: HasManyRemoveAssociationMixin<AI.Instance, AI.Instance["id"]>;
        removeAIs: HasManyRemoveAssociationsMixin<AI.Instance, AI.Instance["id"]>;
        hasAI: HasManyHasAssociationMixin<AI.Instance, AI.Instance["id"]>;
        hasAIs: HasManyHasAssociationsMixin<AI.Instance, AI.Instance["id"]>;
        countAIs: HasManyCountAssociationsMixin;
    }
    const sequelizeDefinition: ModelAttributes<AllyTeam.Instance, AllyTeam.Schema>;
    const sequelizeOptions: ModelOptions;
}
