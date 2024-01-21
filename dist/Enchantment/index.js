"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEnchantment = void 0;
const DebugItem_1 = require("./DebugItem");
const Common_1 = require("./Common");
const weapons_1 = require("./weapons");
const armor_1 = require("./armor");
const IdentifySpell_1 = require("./IdentifySpell");
const RemoveCurseSpell_1 = require("./RemoveCurseSpell");
async function createEnchantment(dm) {
    const enchDataList = await Promise.all([
        ...await (0, weapons_1.weaponsEnch)(dm),
        ...await (0, armor_1.armorEnch)(dm),
    ]);
    //预处理并展开附魔flag
    const enchFlagList = await (0, Common_1.prepareProc)(dm, enchDataList);
    //生成调试道具
    await (0, DebugItem_1.debugItem)(dm, enchFlagList);
    await (0, IdentifySpell_1.identifySpell)(dm);
    await (0, RemoveCurseSpell_1.removeCurseSpell)(dm);
}
exports.createEnchantment = createEnchantment;
