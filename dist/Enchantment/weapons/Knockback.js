"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnockbackMaxLvl = exports.KnockbackEID = void 0;
exports.Knockback = Knockback;
const EMDefine_1 = require("../../EMDefine");
const UtilGener_1 = require("../UtilGener");
const Common_1 = require("../Common");
exports.KnockbackEID = "Knockback";
exports.KnockbackMaxLvl = 5;
async function Knockback(dm) {
    const enchName = "击退";
    const out = [];
    //构造附魔集
    const enchData = {
        id: exports.KnockbackEID,
        main: (0, UtilGener_1.genMainFlag)(exports.KnockbackEID, enchName),
        ench_type: ["weapons"],
        lvl: []
    };
    out.push(enchData.main);
    //触发法术
    const tspell = {
        id: EMDefine_1.EMDef.genSpellID(`${exports.KnockbackEID}_Trigger`),
        type: "SPELL",
        flags: [...EMDefine_1.CON_SPELL_FLAG],
        min_damage: 1,
        max_damage: exports.KnockbackMaxLvl,
        damage_increment: 1,
        max_level: exports.KnockbackMaxLvl - 1,
        damage_type: "Knockback",
        effect: "attack",
        shape: "blast",
        valid_targets: ["ally", "hostile", "self"],
        name: `${enchName} 附魔触发法术`,
        description: `${enchName} 附魔触发法术`
    };
    out.push(tspell);
    //构造等级变体
    for (let i = 1; i <= exports.KnockbackMaxLvl; i++) {
        const subName = `${enchName} ${(0, UtilGener_1.numToRoman)(i)}`;
        //变体ID
        const ench = {
            type: "json_flag",
            id: (0, Common_1.enchLvlID)(exports.KnockbackEID, i),
            name: subName,
            info: (0, UtilGener_1.genEnchInfo)('pink', subName, `这件物品可以造成 ${i} 点击退伤害`),
            item_prefix: (0, UtilGener_1.genEnchPrefix)('pink', subName),
        };
        //触发eoc
        const teoc = (0, UtilGener_1.genWieldTrigger)(dm, ench.id, "TryMeleeAttack", [
            { npc_location_variable: { context_val: `${exports.KnockbackEID}_loc` } },
            { u_cast_spell: { id: tspell.id, min_level: i - 1 }, loc: { context_val: `${exports.KnockbackEID}_loc` } }
        ]);
        //加入输出
        out.push(ench, teoc);
        enchData.lvl.push({
            ench,
            weight: exports.KnockbackMaxLvl + 1 - i,
            point: i * 2,
        });
    }
    //互斥附魔flag
    (0, UtilGener_1.genBaseConfilcts)(enchData);
    dm.addData(out, "ench", exports.KnockbackEID);
    return enchData;
}
