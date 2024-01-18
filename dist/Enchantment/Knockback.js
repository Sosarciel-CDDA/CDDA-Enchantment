"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.knockback = void 0;
const EMDefine_1 = require("../EMDefine");
const UtilGener_1 = require("./UtilGener");
async function knockback(dm) {
    const enchName = "击退";
    const enchId = "Knockback";
    const maxLvl = 5;
    const out = [];
    //构造附魔集
    const mainench = {
        type: "json_flag",
        id: enchId,
        name: enchName,
    };
    out.push(mainench);
    const enchSet = {
        main: mainench,
        lvl: []
    };
    for (let i = 1; i <= maxLvl; i++) {
        const subid = `${enchId}_${i}`;
        const subName = `${enchName} ${(0, UtilGener_1.numToRoman)(i)}`;
        const ench = {
            type: "json_flag",
            id: subid,
            name: subName,
            info: `<color_white>[${subName}]</color> 这件物品可以造成 ${i} 点击退伤害`,
        };
        const tspell = {
            id: EMDefine_1.EMDef.genSpellID(subid),
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
        const teoc = (0, UtilGener_1.genWieldTrigger)(dm, ench.id, "TryMeleeAttack", [
            { npc_location_variable: { global_val: `_${enchId}_loc` } },
            { u_cast_spell: { id: tspell.id }, loc: { global_val: `_${enchId}_loc` } }
        ]);
        out.push(ench, tspell, teoc);
        enchSet.lvl.push({ ench, weight: maxLvl + 1 - i });
    }
    //互斥
    enchSet.lvl.forEach((lvlobj) => {
        const ench = lvlobj.ench;
        ench.conflicts = ench.conflicts ?? [];
        ench.conflicts.push(...enchSet.lvl
            .filter((sublvlobj) => sublvlobj.ench.id != ench.id)
            .map((subelvlobj) => subelvlobj.ench.id));
    });
    dm.addStaticData(out, "ench", enchId);
    return enchSet;
}
exports.knockback = knockback;
