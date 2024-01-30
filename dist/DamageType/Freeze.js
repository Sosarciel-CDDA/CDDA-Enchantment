"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Freeze = void 0;
const UtilGener_1 = require("./UtilGener");
const EMDefine_1 = require("../EMDefine");
//冻结
async function Freeze(dm) {
    const did = "Freeze";
    const dname = "冻结";
    const tspell = {
        type: "SPELL",
        id: EMDefine_1.EMDef.genSpellID(`${did}_Trigger`),
        name: "冻结触发",
        description: "冻结触发",
        effect: "mod_moves",
        min_damage: { math: [`tmp${did}Dmg`] },
        max_damage: EMDefine_1.MAX_NUM,
        valid_targets: ["self"],
        shape: "blast"
    };
    const onDmgEoc = {
        type: "effect_on_condition",
        eoc_type: "ACTIVATION",
        id: EMDefine_1.EMDef.genEOCID(`${did}_OnDamage`),
        effect: [
            { u_message: `${dname} 触发 <context_val:total_damage> <context_val:damage_taken>` },
            { math: [`tmp${did}Dmg`, "=", "0 - (_total_damage*100)"] },
            { npc_cast_spell: { id: tspell.id, hit_self: true } },
        ],
        condition: { math: ["_total_damage", ">", "0"] }
    };
    const dt = {
        id: did,
        type: "damage_type",
        name: dname,
        magic_color: "light_blue",
        ondamage_eocs: [onDmgEoc.id],
        no_resist: true
    };
    dm.addStaticData([onDmgEoc, dt, tspell, (0, UtilGener_1.genDIO)(dt)], "damage_type", did);
}
exports.Freeze = Freeze;
