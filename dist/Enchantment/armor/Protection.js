"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Protection = exports.ProtectionMaxLvl = exports.ProtectionEID = void 0;
const EMDefine_1 = require("../../EMDefine");
const UtilGener_1 = require("../UtilGener");
const Common_1 = require("../Common");
const Fragile_1 = require("./Fragile");
exports.ProtectionEID = "Protection";
exports.ProtectionMaxLvl = 5;
async function Protection(dm) {
    const enchName = "保护";
    const out = [];
    //被动效果
    const effid = EMDefine_1.EMDef.genEffectID(exports.ProtectionEID);
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
                        multiply: { math: [`u_effect_intensity('${effid}') * -0.05`] },
                    }, {
                        value: "ARMOR_CUT",
                        multiply: { math: [`u_effect_intensity('${effid}') * -0.05`] },
                    }, {
                        value: "ARMOR_STAB",
                        multiply: { math: [`u_effect_intensity('${effid}') * -0.05`] },
                    }, {
                        value: "ARMOR_BULLET",
                        multiply: { math: [`u_effect_intensity('${effid}') * -0.05`] },
                    }]
            }]
    };
    out.push(enchEffect);
    //构造附魔集
    const enchData = {
        id: exports.ProtectionEID,
        main: (0, UtilGener_1.genMainFlag)(exports.ProtectionEID, enchName),
        effect: [enchEffect.id],
        ench_type: ["armor"],
        lvl: []
    };
    out.push(enchData.main);
    //构造等级变体
    for (let i = 1; i <= exports.ProtectionMaxLvl; i++) {
        const subName = `${enchName} ${(0, UtilGener_1.numToRoman)(i)}`;
        //变体ID
        const ench = {
            type: "json_flag",
            id: (0, Common_1.enchLvlID)(exports.ProtectionEID, i),
            name: subName,
            info: (0, UtilGener_1.genEnchInfo)("good", subName, `这件物品可以降低 ${i * 5}% 所受到的物理伤害`),
        };
        //加入输出
        out.push(ench);
        enchData.lvl.push({
            ench,
            weight: exports.ProtectionMaxLvl + 1 - i,
            intensity: i,
            point: i * 10,
        });
    }
    //互斥附魔flag
    (0, UtilGener_1.genBaseConfilcts)(enchData);
    (0, UtilGener_1.genEnchConfilcts)(enchData, Fragile_1.FragileEID, Fragile_1.FragileMaxLvl);
    dm.addStaticData(out, "ench", exports.ProtectionEID);
    return enchData;
}
exports.Protection = Protection;
