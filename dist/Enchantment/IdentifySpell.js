"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.identifySpell = void 0;
const EMDefine_1 = require("../EMDefine");
const Common_1 = require("./Common");
const EnchInterface_1 = require("./EnchInterface");
async function identifySpell(dm) {
    const out = [];
    //随机鉴定
    const spellId = EMDefine_1.EMDef.genSpellID("RandIdentify");
    const randIdentifyEoc = EMDefine_1.EMDef.genActEoc("RandIdentify_eoc", [
        { run_eocs: Common_1.INIT_ENCH_DATA_EOC_ID },
        { math: ["_identSpellCount", "=", `u_spell_level('${spellId}') / 2 + 1`] },
        { u_run_inv_eocs: "all",
            true_eocs: {
                id: EMDefine_1.EMDef.genEOCID("RandIdebtify_eoc_sub"),
                eoc_type: "ACTIVATION",
                effect: [
                    { if: { and: [
                                { math: ["_identSpellCount", ">=", "1"] },
                                { not: { npc_has_flag: Common_1.IS_IDENTIFYED_FLAG_ID } },
                                { or: EnchInterface_1.VaildEnchTypeList.map((cate) => ({ npc_has_var: Common_1.ITEM_ENCH_TYPE, value: cate })) }
                            ] },
                        then: [
                            { run_eocs: Common_1.IDENTIFY_EOC_ID },
                            { math: ["_identSpellCount", "-=", "1"] }
                        ] }
                ]
            } },
    ]);
    const randIdentify = {
        id: spellId,
        type: "SPELL",
        name: "随机鉴定术",
        description: "随机鉴定背包中几个未鉴定的物品",
        effect: "effect_on_condition",
        effect_str: randIdentifyEoc.id,
        valid_targets: ["self"],
        shape: "blast",
        max_level: 20,
        energy_source: "MANA",
        base_energy_cost: 200,
        base_casting_time: 1000,
    };
    out.push(randIdentify, randIdentifyEoc);
    //指定鉴定
    const selIdentifyEoc = EMDefine_1.EMDef.genActEoc("SelIdentify", [
        { run_eocs: Common_1.INIT_ENCH_DATA_EOC_ID },
        { u_run_inv_eocs: "manual",
            search_data: EnchInterface_1.VaildEnchTypeList.map((cate) => EnchInterface_1.EnchTypeSearchDataMap[cate]).flat(),
            title: "选择要鉴定的物品",
            true_eocs: Common_1.IDENTIFY_EOC_ID },
    ]);
    const selIdentify = {
        id: EMDefine_1.EMDef.genSpellID("SelIdentify"),
        type: "SPELL",
        name: "鉴定术",
        description: "鉴定背包中一个选中的物品",
        effect: "effect_on_condition",
        effect_str: selIdentifyEoc.id,
        valid_targets: ["self"],
        shape: "blast",
        learn_spells: {
            [randIdentify.id]: 5
        },
        energy_source: "MANA",
        base_energy_cost: 50,
        base_casting_time: 1000,
    };
    out.push(selIdentifyEoc, selIdentify);
    dm.addData(out, "IdentifySpell");
}
exports.identifySpell = identifySpell;
