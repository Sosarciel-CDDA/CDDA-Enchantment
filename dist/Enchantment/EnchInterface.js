"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnchTypeSearchDataMap = exports.VaildEnchTypeList = void 0;
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
