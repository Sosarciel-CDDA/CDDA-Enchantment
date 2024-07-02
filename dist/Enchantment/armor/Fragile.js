"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FragileMaxLvl = exports.FragileEID = void 0;
exports.Fragile = Fragile;
const EMDefine_1 = require("../../EMDefine");
const UtilGener_1 = require("../UtilGener");
const Common_1 = require("../Common");
const BindCurse_1 = require("./BindCurse");
const Protection_1 = require("./Protection");
exports.FragileEID = "Fragile";
exports.FragileMaxLvl = 5;
async function Fragile(dm) {
    const enchName = "脆弱";
    const out = [];
    //被动效果
    const effid = EMDefine_1.EMDef.genEffectID(exports.FragileEID);
    const enchEffect = {
        type: "effect_type",
        id: effid,
        name: [`${enchName} 附魔效果`],
        desc: [`${enchName} 附魔正在生效 每层效果提供 5% 物理伤害减免`],
        max_intensity: 15,
        enchantments: [{
                condition: "ALWAYS",
                values: [{
                        value: "ARMOR_BASH",
                        multiply: { math: [`u_effect_intensity('${effid}') * 0.05`] },
                    }, {
                        value: "ARMOR_CUT",
                        multiply: { math: [`u_effect_intensity('${effid}') * 0.05`] },
                    }, {
                        value: "ARMOR_STAB",
                        multiply: { math: [`u_effect_intensity('${effid}') * 0.05`] },
                    }, {
                        value: "ARMOR_BULLET",
                        multiply: { math: [`u_effect_intensity('${effid}') * 0.05`] },
                    }]
            }]
    };
    out.push(enchEffect);
    //构造附魔集
    const enchData = {
        id: exports.FragileEID,
        main: (0, UtilGener_1.genMainFlag)(exports.FragileEID, enchName),
        intensity_effect: [enchEffect.id],
        ench_type: ["armor"],
        lvl: [],
        add_effects: [{ run_eocs: (0, Common_1.auxEID)(BindCurse_1.BindCurseLvlFlagId, "add") }],
        remove_effects: [{ run_eocs: (0, Common_1.auxEID)(BindCurse_1.BindCurseLvlFlagId, "remove") }]
    };
    out.push(enchData.main);
    //构造等级变体
    for (let i = 1; i <= exports.FragileMaxLvl; i++) {
        const subName = `${enchName} ${(0, UtilGener_1.numToRoman)(i)}`;
        //变体ID
        const ench = {
            type: "json_flag",
            id: (0, Common_1.enchLvlID)(exports.FragileEID, i),
            name: subName,
            info: (0, UtilGener_1.genEnchInfo)("bad", subName, `这件物品会增加 ${i * 5}% 所受到的物理伤害`),
            item_prefix: (0, UtilGener_1.genEnchPrefix)('bad', subName),
        };
        //加入输出
        out.push(ench);
        enchData.lvl.push({
            ench,
            weight: (exports.FragileMaxLvl + 1 - i) / 4,
            intensity: i,
        });
    }
    //互斥附魔flag
    (0, UtilGener_1.genBaseConfilcts)(enchData);
    (0, UtilGener_1.genEnchConfilcts)(enchData, Protection_1.ProtectionEID, Protection_1.ProtectionMaxLvl);
    dm.addData(out, "ench", exports.FragileEID);
    return enchData;
}
