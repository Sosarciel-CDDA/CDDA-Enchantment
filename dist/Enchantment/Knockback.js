"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Knockback = void 0;
const EMDefine_1 = require("../EMDefine");
const UtilGener_1 = require("./UtilGener");
async function Knockback(dm) {
    const enchName = "击退";
    const enchId = "Knockback";
    const maxLvl = 5;
    const out = [];
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
        category: ["weapons"],
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
            info: `<color_white>[${subName}]</color> 这件物品可以造成 ${i} 点击退伤害`,
        };
        //触发法术
        const tspell = {
            id: EMDefine_1.EMDef.genSpellID(`${subid}_Trigger`),
            type: "SPELL",
            flags: [...EMDefine_1.CON_SPELL_FLAG],
            min_damage: i,
            max_damage: i,
            damage_type: "Knockback",
            effect: "attack",
            shape: "blast",
            valid_targets: ["ally", "hostile", "self"],
            name: `${subName} 附魔触发法术`,
            description: `${subName} 附魔触发法术`
        };
        //触发eoc
        const teoc = (0, UtilGener_1.genWieldTrigger)(dm, ench.id, "TryMeleeAttack", [
            { npc_location_variable: { global_val: `${enchId}_loc` } },
            { u_cast_spell: { id: tspell.id }, loc: { global_val: `${enchId}_loc` } }
        ]);
        //加入输出
        out.push(ench, tspell, teoc);
        enchData.lvl.push({
            ench,
            weight: maxLvl + 1 - i
        });
    }
    //互斥附魔flag
    (0, UtilGener_1.baseConfilcts)(enchData);
    dm.addStaticData(out, "ench", enchId);
    return enchData;
}
exports.Knockback = Knockback;
