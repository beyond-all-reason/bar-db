"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBSchema = void 0;
const ai_1 = require("./ai");
const alias_1 = require("./alias");
const ally_team_1 = require("./ally-team");
const balance_change_author_1 = require("./balance-change-author");
const balance_change_unit_def_1 = require("./balance-change-unit-def");
const balance_change_1 = require("./balance-change");
const demo_1 = require("./demo");
const player_1 = require("./player");
const spectator_1 = require("./spectator");
const spring_map_1 = require("./spring-map");
const user_1 = require("./user");
var DBSchema;
(function (DBSchema) {
    DBSchema.AI = ai_1.AI;
    DBSchema.Alias = alias_1.Alias;
    DBSchema.AllyTeam = ally_team_1.AllyTeam;
    DBSchema.BalanceChangeAuthor = balance_change_author_1.BalanceChangeAuthor;
    DBSchema.BalanceChangeUnitDef = balance_change_unit_def_1.BalanceChangeUnitDef;
    DBSchema.BalanceChange = balance_change_1.BalanceChange;
    DBSchema.Demo = demo_1.Demo;
    DBSchema.Player = player_1.Player;
    DBSchema.Spectator = spectator_1.Spectator;
    DBSchema.SpringMap = spring_map_1.SpringMap;
    DBSchema.User = user_1.User;
})(DBSchema = exports.DBSchema || (exports.DBSchema = {}));
//# sourceMappingURL=index.js.map