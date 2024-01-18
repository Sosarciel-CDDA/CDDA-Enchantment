"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEnchantment = void 0;
const Knockback_1 = require("./Knockback");
const DebugItem_1 = require("./DebugItem");
async function createEnchantment(dm) {
    const EnchList = [
        await (0, Knockback_1.knockback)(dm),
    ];
    await (0, DebugItem_1.debugItem)(dm, EnchList);
}
exports.createEnchantment = createEnchantment;
