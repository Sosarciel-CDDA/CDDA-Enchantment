import { EMDef } from "@src/EMDefine";
import { JObject } from "@zwa73/utils";
import { DataManager } from "cdda-event";
import { Eoc, Spell } from "cdda-schema";
import { ENCH_CATEGORY, IDENTIFY_EOC_ID, INIT_ENCH_DATA_EOC_ID, N_COMPLETE_IDENTIFY } from "./Common";
import { VaildEnchCategoryList } from "./EnchInterface";



export async function identifySpell(dm:DataManager){
    const out:JObject[] = [];

    //随机鉴定
    const spellId = EMDef.genSpellID("RandIdentify");
    const randIdentifyEoc = EMDef.genActEoc("RandIdentify_eoc",[
        {run_eocs:INIT_ENCH_DATA_EOC_ID},
        {math:["_identSpellCount","=",`u_val('spell_level', 'spell: ${spellId}') / 2 + 1`]},
        {u_run_inv_eocs:"all",
        true_eocs:{
            id:EMDef.genEOCID("RandIdebtify_eoc_sub"),
            eoc_type:"ACTIVATION",
            effect:[
                {if:{and:[
                    {math:["_identSpellCount",">=","1"]},
                    {math:[N_COMPLETE_IDENTIFY,"!=","1"]},
                    {or:VaildEnchCategoryList.map((cate)=>({npc_has_var:ENCH_CATEGORY,value:cate}))}
                ]},
                then:[
                    {run_eocs:IDENTIFY_EOC_ID},
                    {math:["_identSpellCount","-=","1"]}
                ]}
            ]
        }},
    ])
    const randIdentify:Spell={
        id:spellId,
        type:"SPELL",
        name:"随机鉴定术",
        description:"随机鉴定背包中几个未鉴定的物品",
        effect:"effect_on_condition",
        effect_str:randIdentifyEoc.id,
        valid_targets:["self"],
        shape:"blast",
        max_level:20,
        energy_source:"MANA",
        base_energy_cost:200,
        base_casting_time:1000,
    }
    out.push(randIdentify,randIdentifyEoc);

    //指定鉴定
    const selIdentifyEoc = EMDef.genActEoc("SelIdentify",[
        {run_eocs:INIT_ENCH_DATA_EOC_ID},
        {u_run_inv_eocs:"manual",
        search_data:VaildEnchCategoryList.map((cate)=>({category:cate})),
        title:"选择要鉴定的物品",
        true_eocs:IDENTIFY_EOC_ID},
    ])
    const selIdentify:Spell={
        id:EMDef.genSpellID("SelIdentify"),
        type:"SPELL",
        name:"鉴定术",
        description:"鉴定背包中一个选中的物品",
        effect:"effect_on_condition",
        effect_str:selIdentifyEoc.id,
        valid_targets:["self"],
        shape:"blast",
        learn_spells:{
            [randIdentify.id]:5
        },
        energy_source:"MANA",
        base_energy_cost:50,
        base_casting_time:1000,
    }
    out.push(selIdentifyEoc,selIdentify);

    dm.addStaticData(out,"IdentifySpell");
}