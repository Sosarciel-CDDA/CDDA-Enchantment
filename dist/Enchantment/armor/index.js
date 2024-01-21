"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.armorEnch = void 0;
const Protection_1 = require("./Protection");
const BindCurse_1 = require("./BindCurse");
const Fragile_1 = require("./Fragile");
async function armorEnch(dm) {
    return await Promise.all([
        await (0, Protection_1.Protection)(dm),
        await (0, Fragile_1.Fragile)(dm),
        await (0, BindCurse_1.BindCurse)(dm),
    ]);
}
exports.armorEnch = armorEnch;
