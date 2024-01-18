"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Knockback = void 0;
const UtilGener_1 = require("./UtilGener");
const EMDefine_1 = require("../EMDefine");
//击退
async function Knockback(dm) {
    const did = "Knockback";
    const dname = "击退";
    const tmddmg = `tmp${did}Dmg`;
    const tspell_base = {
        type: "SPELL",
        id: EMDefine_1.EMDef.genSpellID(`${did}_Base`),
        name: "击退触发",
        description: "击退触发",
        effect: "directed_push",
        min_damage: 1,
        max_damage: 1,
        min_range: 1000,
        max_range: 1000,
        valid_targets: ["self", "ally", "hostile"],
        shape: "blast",
        flags: ["IGNORE_WALLS", "NO_PROJECTILE"]
    };
    const tspell_bash = {
        type: "SPELL",
        id: EMDefine_1.EMDef.genSpellID(`${did}_Bash`),
        name: "击退触发破坏地形",
        description: "击退触发破坏地形",
        effect: "bash",
        min_damage: { math: [`${tmddmg} * 10`] },
        max_damage: EMDefine_1.SPELL_MAX_DAMAGE,
        min_aoe: 1,
        max_aoe: 1,
        valid_targets: ["ground"],
        shape: "blast",
        flags: ["NO_EXPLOSION_SFX", "IGNORE_WALLS", "NO_PROJECTILE"]
    };
    const tspell_subdamage = {
        type: "SPELL",
        id: EMDefine_1.EMDef.genSpellID(`${did}_Subdamage`),
        name: "击退触发子伤害",
        description: "击退触发子伤害",
        effect: "attack",
        damage_type: "bash",
        min_damage: { math: [tmddmg] },
        max_damage: EMDefine_1.SPELL_MAX_DAMAGE,
        min_aoe: 1,
        max_aoe: 1,
        valid_targets: ["self", "ally", "hostile", "ground"],
        shape: "blast",
        flags: ["SILENT", "NO_EXPLOSION_SFX", "IGNORE_WALLS", "NO_PROJECTILE"]
    };
    const tspell_subknockback = {
        type: "SPELL",
        id: EMDefine_1.EMDef.genSpellID(`${did}_Subknockback`),
        name: "击退触发子击退",
        description: "击退触发子击退",
        effect: "area_push",
        min_aoe: 2,
        max_aoe: 2,
        valid_targets: ["ally", "hostile", "item", "ground"],
        shape: "blast",
        flags: ["SILENT", "NO_EXPLOSION_SFX", "IGNORE_WALLS", "NO_PROJECTILE"]
    };
    const onDmgEoc = {
        type: "effect_on_condition",
        eoc_type: "ACTIVATION",
        id: EMDefine_1.EMDef.genEOCID(`${did}_OnDamage`),
        effect: [
            { u_message: `${dname} 触发 <context_val:total_damage> <context_val:damage_taken>` },
            { math: [tmddmg, "=", "_total_damage"] },
            { set_condition: { global_val: "knockback_cond" }, condition: { math: [tmddmg, ">", "0"] } },
            { run_eoc_until: {
                    id: EMDefine_1.EMDef.genEOCID(`${did}_OnDamage_each`),
                    eoc_type: "ACTIVATION",
                    effect: [
                        { npc_location_variable: { global_val: "tmp_knockback_loc" } },
                        { u_cast_spell: { id: tspell_base.id }, loc: { global_val: "tmp_knockback_loc" } },
                        { npc_cast_spell: { id: tspell_bash.id } },
                        { npc_cast_spell: { id: tspell_subdamage.id } },
                        { npc_cast_spell: { id: tspell_subknockback.id } },
                        { math: [tmddmg, "-=", "1"] },
                    ]
                }, condition: { global_val: "knockback_cond" } },
        ],
        condition: { math: ["_total_damage", ">", "0"] }
    };
    const dt = {
        id: did,
        type: "damage_type",
        name: dname,
        magic_color: "white",
        ondamage_eocs: [onDmgEoc.id],
        derived_from: ["bash", 1]
    };
    dm.addStaticData([onDmgEoc, dt, tspell_base, tspell_bash, tspell_subdamage, tspell_subknockback, (0, UtilGener_1.genDIO)(dt)], "damage_type", did);
}
exports.Knockback = Knockback;
