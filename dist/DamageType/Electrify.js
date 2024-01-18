"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Discharge = exports.Electrify = void 0;
const UtilGener_1 = require("./UtilGener");
const EMDefine_1 = require("../EMDefine");
//感电
async function Electrify(dm) {
    const did = "Electrify";
    const extid = "Serial";
    const dur = "60 s";
    const eff = {
        type: "effect_type",
        id: did,
        name: ["感电"],
        desc: [`可被 放电 伤害激发, 造成相当于 放电伤害*感电层数 的电击伤害。`],
        max_intensity: EMDefine_1.TEFF_MAX,
        max_duration: dur,
        show_in_info: true,
    };
    const onDmgEoc = {
        type: "effect_on_condition",
        eoc_type: "ACTIVATION",
        id: EMDefine_1.EMDef.genEOCID(`${did}_OnDamage`),
        effect: [
            //regenDmg,
            { u_message: "感电触发 <context_val:total_damage> <context_val:damage_taken>" },
            {
                npc_add_effect: did,
                duration: dur,
                intensity: { math: [`n_effect_intensity('${did}') + (_total_damage * (n_effect_intensity('${extid}')>0? 4 : 1))`] }
            },
        ],
        condition: { math: ["_total_damage", ">", "0"] }
    };
    const dt = {
        id: did,
        type: "damage_type",
        name: "感电",
        magic_color: "yellow",
        derived_from: ["electric", 0],
        ondamage_eocs: [onDmgEoc.id]
    };
    //串流
    const exteff = {
        type: "effect_type",
        id: extid,
        name: ["串流"],
        desc: ["感电 叠加的层数变为 4 倍。"],
        max_intensity: 1,
        max_duration: dur,
        show_in_info: true,
    };
    dm.addStaticData([eff, onDmgEoc, dt, exteff, (0, UtilGener_1.genDIO)(dt)], "damage_type", did);
}
exports.Electrify = Electrify;
//放电
async function Discharge(dm) {
    const did = "Discharge";
    const dmgeffid = "Electrify";
    const tspell = {
        type: "SPELL",
        id: EMDefine_1.EMDef.genSpellID(`${did}_Trigger`),
        name: "放电感电触发伤害",
        description: "放电感电触发伤害",
        effect: "attack",
        min_damage: { math: [`u_effect_intensity('${dmgeffid}') * tmpDischargeDmg`] },
        max_damage: EMDefine_1.SPELL_MAX_DAMAGE,
        valid_targets: ["self"],
        shape: "blast",
        damage_type: "electric",
    };
    const onDmgEoc = {
        type: "effect_on_condition",
        eoc_type: "ACTIVATION",
        id: EMDefine_1.EMDef.genEOCID(`${did}_OnDamage`),
        effect: [
            //regenDmg,
            { u_message: "放电触发 <context_val:total_damage> <context_val:damage_taken>" },
            { math: ["tmpDischargeDmg", "=", "_total_damage/10"] },
            { npc_cast_spell: { id: tspell.id, hit_self: true } },
            //{math:[`_stack`,"=",`n_effect_intensity('${dmgeffid}')`]},
            //{u_message:"感电层数 <context_val:stack>"},
            { npc_lose_effect: dmgeffid },
        ],
        condition: { math: ["_total_damage", ">", "0"] }
    };
    const dt = {
        id: did,
        type: "damage_type",
        name: "放电",
        magic_color: "yellow",
        ondamage_eocs: [onDmgEoc.id],
        no_resist: true
    };
    dm.addStaticData([onDmgEoc, dt, tspell, (0, UtilGener_1.genDIO)(dt)], "damage_type", did);
}
exports.Discharge = Discharge;
