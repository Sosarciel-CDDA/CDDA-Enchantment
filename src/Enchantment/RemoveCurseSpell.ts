import { JObject } from "@zwa73/utils";
import { DataManager } from "@sosarciel-cdda/event";
import { AnyItemFlag, Spell } from "@sosarciel-cdda/schema";
import { IS_CURSED_FLAG_ID, REMOVE_CURSE_EOC_ID } from "./Common";
import { EMDef } from "@src/EMDefine";



export async function removeCurseSpell(dm:DataManager){
    const out:JObject[] = [];

    //随机鉴定
    const spellId = EMDef.genSpellID("RandRemoveCurse");
    const randRemoveCurseEoc = EMDef.genActEoc("RandRemoveCurse_eoc",[
        {math:["_removeCurseSpellCount","=",`u_spell_level('${spellId}') / 4 + 1`]},
        {u_run_inv_eocs:"all",
        true_eocs:{
            id:EMDef.genEOCID("RandIdebtify_eoc_sub"),
            eoc_type:"ACTIVATION",
            effect:[
                {if:{and:[
                    {math:["_removeCurseSpellCount",">=","1"]},
                    {npc_has_flag:IS_CURSED_FLAG_ID},
                ]},
                then:[
                    {run_eocs:REMOVE_CURSE_EOC_ID},
                    {math:["_removeCurseSpellCount","-=","1"]}
                ]}
            ]
        }},
    ])
    const randRemoveCurse:Spell={
        id:spellId,
        type:"SPELL",
        name:"随机诅咒移除",
        description:"随机移除背包中几个诅咒物品的所有诅咒",
        effect:"effect_on_condition",
        effect_str:randRemoveCurseEoc.id,
        valid_targets:["self"],
        shape:"blast",
        max_level:20,
        energy_source:"MANA",
        base_energy_cost:1000,
        base_casting_time:1000,
    }
    out.push(randRemoveCurse,randRemoveCurseEoc);



    //指定移除
    const removeCurse = EMDef.genActEoc("SelRemoveCurse_eoc",[{
        u_run_inv_eocs:"manual",
        search_data:[{flags:[IS_CURSED_FLAG_ID as AnyItemFlag]}],
        true_eocs:{
            eoc_type:"ACTIVATION",
            id:EMDef.genEOCID("SelRemoveCurse_eoc_sub"),
            effect:[{run_eocs:REMOVE_CURSE_EOC_ID}]
        }
    }]);
    const selRemove:Spell={
        id:EMDef.genSpellID("RemoveCurse"),
        type:"SPELL",
        name:"诅咒移除",
        description:"移除背包中一选中物品的所有诅咒",
        effect:"effect_on_condition",
        effect_str:removeCurse.id,
        valid_targets:["self"],
        shape:"blast",
        learn_spells:{
            [randRemoveCurse.id]:5
        },
        energy_source:"MANA",
        base_energy_cost:250,
        base_casting_time:1000,
    }
    out.push(removeCurse,selRemove);

    dm.addData(out,"IdentifySpell");
}