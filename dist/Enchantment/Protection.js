"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Protection = void 0;
const EMDefine_1 = require("../EMDefine");
const UtilGener_1 = require("./UtilGener");
async function Protection(dm) {
    const enchName = "保护";
    const enchId = "Protection";
    const maxLvl = 5;
    const out = [];
    //被动效果
    const effid = EMDefine_1.EMDef.genEffectID(enchId);
    const enchEffect = {
        type: "effect_type",
        id: effid,
        name: [`${enchName} 附魔效果`],
        desc: [`${enchName} 附魔正在生效`],
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
    const mainench = {
        type: "json_flag",
        id: EMDefine_1.EMDef.genFlagID(`${enchId}_Ench`),
        name: enchName,
    };
    out.push(mainench);
    const enchData = {
        id: enchId,
        main: mainench,
        effect: enchEffect,
        category: ["armor"],
        lvl: []
    };
    //构造等级变体
    for (let i = 1; i <= maxLvl; i++) {
        const subid = `${enchId}_${i}`;
        const subName = `${enchName} ${(0, UtilGener_1.numToRoman)(i)}`;
        //变体ID
        const ench = {
            type: "json_flag",
            id: EMDefine_1.EMDef.genFlagID(`${subid}_Ench`),
            name: subName,
            info: `<color_white>[${subName}]</color> 这件物品可以降低 ${i * 5}% 的物理伤害`,
        };
        //加入输出
        out.push(ench);
        enchData.lvl.push({
            ench,
            weight: maxLvl + 1 - i,
            intensity: i
        });
    }
    //互斥附魔flag
    (0, UtilGener_1.baseConfilcts)(enchData);
    dm.addStaticData(out, "ench", enchId);
    return enchData;
}
exports.Protection = Protection;
