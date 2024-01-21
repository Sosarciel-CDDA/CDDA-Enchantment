"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseConfilcts = exports.numToRoman = exports.genWieldTrigger = void 0;
const EMDefine_1 = require("../EMDefine");
/**手持触发 */
function genWieldTrigger(dm, flagId, hook, effects, condition) {
    const eoc = EMDefine_1.EMDef.genActEoc(`${flagId}_WieldTigger`, effects, { and: [
            { u_has_wielded_with_flag: flagId },
            ...(condition ? [condition] : [])
        ] });
    dm.addInvokeEoc(hook, 0, eoc);
    return eoc;
}
exports.genWieldTrigger = genWieldTrigger;
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
exports.numToRoman = numToRoman;
/**添加同附魔lvl变体的基础互斥 */
function baseConfilcts(enchData) {
    enchData.lvl.forEach((lvlobj) => {
        const ench = lvlobj.ench;
        ench.conflicts = ench.conflicts ?? [];
        ench.conflicts.push(...enchData.lvl
            .filter((sublvlobj) => sublvlobj.ench.id != ench.id)
            .map((subelvlobj) => subelvlobj.ench.id));
    });
}
exports.baseConfilcts = baseConfilcts;
