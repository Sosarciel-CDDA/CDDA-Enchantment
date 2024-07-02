"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genWieldTrigger = genWieldTrigger;
exports.numToRoman = numToRoman;
exports.genBaseConfilcts = genBaseConfilcts;
exports.genEnchConfilcts = genEnchConfilcts;
exports.genMainFlag = genMainFlag;
exports.genEnchInfo = genEnchInfo;
exports.genEnchPrefix = genEnchPrefix;
const EMDefine_1 = require("../EMDefine");
const cdda_schema_1 = require("cdda-schema");
const Common_1 = require("./Common");
/**手持触发 */
function genWieldTrigger(dm, flagId, hook, effects, condition) {
    const eoc = EMDefine_1.EMDef.genActEoc(`${flagId}_WieldTigger`, effects, { and: [
            { u_has_wielded_with_flag: flagId },
            ...(condition ? [condition] : [])
        ] });
    dm.addInvokeEoc(hook, 0, eoc);
    return eoc;
}
function numToRoman(num) {
    const romanNumerals = {
        M: 1000,
        CM: 900,
        D: 500,
        CD: 400,
        C: 100,
        XC: 90,
        L: 50,
        XL: 40,
        X: 10,
        IX: 9,
        V: 5,
        IV: 4,
        I: 1,
    };
    let roman = '';
    for (let key in romanNumerals) {
        const fixk = key;
        while (num >= romanNumerals[fixk]) {
            roman += key;
            num -= romanNumerals[fixk];
        }
    }
    return roman;
}
/**添加同附魔lvl变体的基础互斥 */
function genBaseConfilcts(enchData) {
    enchData.lvl.forEach((lvlobj) => {
        const ench = lvlobj.ench;
        ench.conflicts = ench.conflicts ?? [];
        ench.conflicts.push(...enchData.lvl
            .filter((sublvlobj) => sublvlobj.ench.id != ench.id)
            .map((subelvlobj) => subelvlobj.ench.id));
    });
}
/**根据ID与最大等级添加附魔互斥 */
function genEnchConfilcts(enchData, baseID, maxLvl) {
    enchData.lvl.forEach((lvlobj) => {
        const ench = lvlobj.ench;
        ench.conflicts = ench.conflicts ?? [];
        for (let lvl = 1; lvl <= maxLvl; lvl++)
            ench.conflicts.push((0, Common_1.enchLvlID)(baseID, lvl));
    });
}
/**生成主附魔flag */
function genMainFlag(enchId, enchName) {
    return {
        type: "json_flag",
        id: EMDefine_1.EMDef.genFlagID(`${enchId}_Main_Ench`),
        name: enchName,
    };
}
/**生成附魔说明 */
function genEnchInfo(color, name, desc) {
    if (cdda_schema_1.ColorList.includes(color))
        return `<color_${color}>[${name}]</color> ${desc}`;
    return `<${color}>[${name}]</${color}> ${desc}`;
}
/**生成附魔前缀 */
function genEnchPrefix(color, name) {
    if (cdda_schema_1.ColorList.includes(color))
        return `<color_${color}>[${name}]</color> `;
    return `<${color}>[${name}]</${color}> `;
}
