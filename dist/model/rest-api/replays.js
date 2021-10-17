"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaysQuerySchema = exports.ReplayPreset = void 0;
const typebox_1 = require("@sinclair/typebox");
const pagination_1 = require("~/model/rest-api/pagination");
var ReplayPreset;
(function (ReplayPreset) {
    ReplayPreset["FFA"] = "ffa";
    ReplayPreset["Team"] = "team";
    ReplayPreset["Duel"] = "duel";
})(ReplayPreset = exports.ReplayPreset || (exports.ReplayPreset = {}));
exports.replaysQuerySchema = pagination_1.paginateQuerySchema(typebox_1.Type.Object({
    preset: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.Enum(ReplayPreset))),
    endedNormally: typebox_1.Type.Boolean({ default: true }),
    hasBots: typebox_1.Type.Boolean({ default: false }),
    tsRange: typebox_1.Type.Optional(typebox_1.Type.Tuple([
        typebox_1.Type.Number(),
        typebox_1.Type.Number()
    ])),
    reported: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    players: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
    maps: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
    date: typebox_1.Type.Optional(typebox_1.Type.Union([
        typebox_1.Type.Tuple([
            typebox_1.Type.String({ format: "date-time" }),
            typebox_1.Type.String({ format: "date-time" })
        ]),
        typebox_1.Type.Tuple([
            typebox_1.Type.String({ format: "date-time" })
        ])
    ])),
    durationRangeMins: typebox_1.Type.Optional(typebox_1.Type.Tuple([
        typebox_1.Type.Number(),
        typebox_1.Type.Number()
    ])),
}));
//# sourceMappingURL=replays.js.map