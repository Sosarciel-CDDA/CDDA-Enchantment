import { DamageType, DamageTypeID, Effect, EffectID, Eoc, Spell } from "@sosarciel-cdda/schema";
import { genDIO } from "./UtilGener";
import { EMDef, MAX_NUM } from "@src/EMDefine";
import { DataManager } from "@sosarciel-cdda/event";

//感电
export async function Electrify(dm:DataManager){
    const did = "Electrify" as DamageTypeID;
    const extid = "Serial" as EffectID;
    const dur = "60 s";
    const eff:Effect = {
        type:"effect_type",
        id: did as EffectID,
        name:["感电"],
        desc:[`可被 放电 伤害激发, 造成相当于 放电伤害*感电层数 的电击伤害。`],
        max_intensity:MAX_NUM,
        max_duration:dur,
        show_in_info:true,
    }
    const onDmgEoc:Eoc={
        type:"effect_on_condition",
        eoc_type:"ACTIVATION",
        id:EMDef.genEOCID(`${did}_OnDamage`),
        effect:[
            //regenDmg,
            {u_message:"感电触发 <context_val:total_damage> <context_val:damage_taken>"},
            {
                npc_add_effect:did as EffectID,
                duration:dur,
                intensity:{math:[`n_effect_intensity('${did}') + (_total_damage * (n_effect_intensity('${extid}')>0? 4 : 1))`]}
            },
        ],
        condition:{math:["_total_damage",">","0"]}
    }
    const dt:DamageType = {
        id: did,
        type: "damage_type",
        name: "感电",
        magic_color: "yellow",
        derived_from:["electric",0],
        ondamage_eocs: [ onDmgEoc.id ]
    }
    //串流
    const exteff:Effect = {
        type:"effect_type",
        id: extid,
        name:["串流"],
        desc:["感电 叠加的层数变为 4 倍。"],
        max_intensity:1,
        max_duration:dur,
        show_in_info:true,
    }
    dm.addData([eff,onDmgEoc,dt,exteff,genDIO(dt)], "damage_type", did);
}

//放电
export async function Discharge(dm:DataManager){
    const did = "Discharge" as DamageTypeID;
    const dmgeffid = "Electrify" as EffectID;
    const tspell:Spell={
        type:"SPELL",
        id:EMDef.genSpellID(`${did}_Trigger`),
        name:"放电感电触发伤害",
        description:"放电感电触发伤害",
        effect:"attack",
        min_damage:{math:[`u_effect_intensity('${dmgeffid}') * tmpDischargeDmg`]},
        max_damage:MAX_NUM,
        valid_targets:["self"],
        shape:"blast",
        damage_type:"electric",
    }
    const onDmgEoc:Eoc={
        type:"effect_on_condition",
        eoc_type:"ACTIVATION",
        id:EMDef.genEOCID(`${did}_OnDamage`),
        effect:[
            //regenDmg,
            {u_message:"放电触发 <context_val:total_damage> <context_val:damage_taken>"},
            {math:["tmpDischargeDmg","=","_total_damage/10"]},
            {npc_cast_spell:{id:tspell.id,hit_self:true}},
            //{math:[`_stack`,"=",`n_effect_intensity('${dmgeffid}')`]},
            //{u_message:"感电层数 <context_val:stack>"},
            {npc_lose_effect:dmgeffid},
        ],
        condition:{math:["_total_damage",">","0"]}
    }
    const dt:DamageType = {
        id: did,
        type: "damage_type",
        name: "放电",
        magic_color: "yellow",
        ondamage_eocs: [ onDmgEoc.id ],
        no_resist:true
    }
    dm.addData([onDmgEoc,dt,tspell,genDIO(dt)], "damage_type", did);
}