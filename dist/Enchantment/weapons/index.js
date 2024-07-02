"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.weaponsEnch = weaponsEnch;
const Knockback_1 = require("./Knockback");
async function weaponsEnch(dm) {
    return await Promise.all([
        await (0, Knockback_1.Knockback)(dm),
    ]);
}
