"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEnchantment = void 0;
const Knockback_1 = require("./Knockback");
const DebugItem_1 = require("./DebugItem");
const Common_1 = require("./Common");
const Protection_1 = require("./Protection");
async function createEnchantment(dm) {
    const enchDataList = [
        await (0, Knockback_1.Knockback)(dm),
        await (0, Protection_1.Protection)(dm),
    ];
    //预处理并展开附魔flag
    const enchFlagList = await (0, Common_1.prepareProc)(dm, enchDataList);
    //生成调试道具
    await (0, DebugItem_1.debugItem)(dm, enchFlagList);
}
exports.createEnchantment = createEnchantment;
