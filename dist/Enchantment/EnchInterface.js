"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EffectActiveCondSearchDataMap = exports.EffectActiveCondList = exports.EnchTypeSearchDataMap = exports.VaildEnchTypeList = void 0;
/**可用的附魔类型 列表 */
exports.VaildEnchTypeList = [
    "weapons",
    "armor",
    //"food"      ,
];
/**附魔类型映射 */
exports.EnchTypeSearchDataMap = {
    weapons: [{ category: "weapons" }],
    armor: [{ category: "armor" }],
    //food    :[{flags:["EATEN_HOT"]},{flags:["SMOKABLE"]}],
};
/**附魔强度效果的生效时机 列表 */
exports.EffectActiveCondList = [
    "wield",
    "worn",
];
/**生效时机映射 */
exports.EffectActiveCondSearchDataMap = {
    wield: [{ wielded_only: true }],
    worn: [{ worn_only: true }],
    //food    :[{flags:["EATEN_HOT"]},{flags:["SMOKABLE"]}],
};
