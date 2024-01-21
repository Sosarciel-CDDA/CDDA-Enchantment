import { EMDef } from "@src/EMDefine";
import { JObject } from "@zwa73/utils";
import { DataManager } from "cdda-event";
import { Eoc, Spell } from "cdda-schema";
import { IDENTIFY_EOC_ID, INIT_ENCH_DATA_EOC_ID } from "./Common";



export async function identifySpell(dm:DataManager){
    const out:JObject[] = [];

    //随机鉴定
    const spellId = EMDef.genSpellID("RandIdentify");
    const randIdentifyEoc = EMDef.genActEoc("RandIdentify_eoc",[
        {run_eocs:INIT_ENCH_DATA_EOC_ID},
        {math:["_identSpellCount","=",`u_val('spell_level', 'spell: ${spellId}') / 2 + 1`]},
        {u_run_inv_eocs:"all",
        search_data:[{wielded_only:true},{worn_only:true}],
        true_eocs:{
            id:EMDef.genEOCID("RandIdebtify_eoc_sub"),
            eoc_type:"ACTIVATION",
            effect:[
                {if:{math:["_identSpellCount",">=","1"]},
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
        description:"随机鉴定背包中的几个未鉴定物品",
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
        {u_run_inv_eocs:"manual",true_eocs:IDENTIFY_EOC_ID},
    ])
    const selIdentify:Spell={
        id:EMDef.genSpellID("SelIdentify"),
        type:"SPELL",
        name:"鉴定术",
        description:"随机鉴定背包中的一个选择的物品",
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