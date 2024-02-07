"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCurseSpell = void 0;
const Common_1 = require("./Common");
const EMDefine_1 = require("../EMDefine");
async function removeCurseSpell(dm) {
    const out = [];
    //随机鉴定
    const spellId = EMDefine_1.EMDef.genSpellID("RandRemoveCurse");
    const randRemoveCurseEoc = EMDefine_1.EMDef.genActEoc("RandRemoveCurse_eoc", [
        { math: ["_removeCurseSpellCount", "=", `u_spell_level('${spellId}') / 4 + 1`] },
        { u_run_inv_eocs: "all",
            true_eocs: {
                id: EMDefine_1.EMDef.genEOCID("RandIdebtify_eoc_sub"),
                eoc_type: "ACTIVATION",
                effect: [
                    { if: { and: [
                                { math: ["_removeCurseSpellCount", ">=", "1"] },
                                { npc_has_flag: Common_1.IS_CURSED_FLAG_ID },
                            ] },
                        then: [
                            { run_eocs: Common_1.REMOVE_CURSE_EOC_ID },
                            { math: ["_removeCurseSpellCount", "-=", "1"] }
                        ] }
                ]
            } },
    ]);
    const randRemoveCurse = {
        id: spellId,
        type: "SPELL",
        name: "随机诅咒移除",
        description: "随机移除背包中几个诅咒物品的所有诅咒",
        effect: "effect_on_condition",
        effect_str: randRemoveCurseEoc.id,
        valid_targets: ["self"],
        shape: "blast",
        max_level: 20,
        energy_source: "MANA",
        base_energy_cost: 1000,
        base_casting_time: 1000,
    };
    out.push(randRemoveCurse, randRemoveCurseEoc);
    //指定移除
    const removeCurse = EMDefine_1.EMDef.genActEoc("SelRemoveCurse_eoc", [{
            u_run_inv_eocs: "manual",
            search_data: [{ flags: [Common_1.IS_CURSED_FLAG_ID] }],
            true_eocs: {
                eoc_type: "ACTIVATION",
                id: EMDefine_1.EMDef.genEOCID("SelRemoveCurse_eoc_sub"),
                effect: [{ run_eocs: Common_1.REMOVE_CURSE_EOC_ID }]
            }
        }]);
    const selRemove = {
        id: EMDefine_1.EMDef.genSpellID("RemoveCurse"),
        type: "SPELL",
        name: "诅咒移除",
        description: "移除背包中一选中物品的所有诅咒",
        effect: "effect_on_condition",
        effect_str: removeCurse.id,
        valid_targets: ["self"],
        shape: "blast",
        learn_spells: {
            [randRemoveCurse.id]: 5
        },
        energy_source: "MANA",
        base_energy_cost: 250,
        base_casting_time: 1000,
    };
    out.push(removeCurse, selRemove);
    dm.addData(out, "IdentifySpell");
}
exports.removeCurseSpell = removeCurseSpell;
