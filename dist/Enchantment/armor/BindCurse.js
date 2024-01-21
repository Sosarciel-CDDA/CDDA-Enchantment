"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BindCurse = exports.BindCurseLvlFlagId = exports.BindCurseEID = void 0;
const UtilGener_1 = require("../UtilGener");
const Common_1 = require("../Common");
exports.BindCurseEID = "BindCurse";
exports.BindCurseLvlFlagId = (0, Common_1.enchLvlID)(exports.BindCurseEID, 1);
async function BindCurse(dm) {
    const enchName = "绑定诅咒";
    const out = [];
    //构造附魔集
    const enchData = {
        id: exports.BindCurseEID,
        main: (0, UtilGener_1.genMainFlag)(exports.BindCurseEID, enchName),
        categorys: ["armor"],
        lvl: [],
        is_curse: true
    };
    out.push(enchData.main);
    //构造等级变体
    //变体ID
    const ench = {
        type: "json_flag",
        id: exports.BindCurseLvlFlagId,
        name: enchName,
        info: (0, UtilGener_1.genEnchInfo)("magenta", enchName, `这件物品在移除诅咒前无法脱下`),
    };
    //加入输出
    out.push(ench);
    enchData.lvl.push({ ench,
        add_effects: [
            { npc_set_flag: "INTEGRATED" },
            { u_message: "你从一件装备上发现了绑定诅咒", type: "bad" },
        ],
        remove_effects: [{ npc_unset_flag: "INTEGRATED" }],
    });
    dm.addStaticData(out, "ench", exports.BindCurseEID);
    return enchData;
}
exports.BindCurse = BindCurse;
