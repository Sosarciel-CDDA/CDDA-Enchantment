import { DamageType, DamageTypeID, Effect, EffectID, Eoc, Spell } from "@sosarciel-cdda/schema";
import { genDIO } from "./UtilGener";
import { EMDef, MAX_NUM } from "@src/EMDefine";
import { DataManager } from "@sosarciel-cdda/event";


//创伤
export async function Trauma(dm:DataManager){
    const did = "Trauma" as DamageTypeID;
    const extid = "HeavyTrauma" as EffectID;
    const stackcount = MAX_NUM;
    const dur = "15 s";
    const tspell:Spell={
        type:"SPELL",
        id:EMDef.genSpellID(`${did}_Trigger`),
        name:"创伤触发伤害",
        description:"创伤触发伤害",
        effect:"attack",
        min_damage:{math:[`u_effect_intensity('${did}')`]},
        max_damage:MAX_NUM,
        valid_targets:["self"],
        shape:"blast",
        damage_type:"stab",
    }
    const eff:Effect = {
        type:"effect_type",
        id: did as EffectID,
        name:["创伤"],
        desc:[`每秒受到一次相当于 创伤层数 的伤害。`],
        apply_message:"一道伤口正在蚕食着你的躯体",
        base_mods: {
            hurt_min: [1],
            hurt_tick: [1]
        },
        scaling_mods: {
            hurt_min: [1]
        },
        max_intensity:stackcount,
        max_duration:dur,
        show_in_info:true,
    }
    const onDmgEoc:Eoc={
        type:"effect_on_condition",
        eoc_type:"ACTIVATION",
        id:EMDef.genEocID(`${did}_OnDamage`),
        effect:[
            //regenDmg,
            {u_message:"创伤触发 <context_val:total_damage> <context_val:damage_taken>"},
            {npc_add_effect:did as EffectID,duration:dur,intensity:{math:[`n_effect_intensity('${did}') +  (_total_damage * (n_effect_intensity('${extid}')>0? 1.5 : 1))`]}}
        ],
        condition:{math:["_total_damage",">","0"]}
    }
    const dt:DamageType = {
        id: did as DamageTypeID,
        type: "damage_type",
        name: "创伤",
        physical: true,
        magic_color: "white",
        derived_from:["stab",0],
        ondamage_eocs: [ onDmgEoc.id ],
        edged:true,
    }
    //重创
    const exteff:Effect = {
        type:"effect_type",
        id: extid,
        name:["重创"],
        desc:["创伤 叠加的层数变为 1.5 倍。"],
        max_intensity:1,
        max_duration:dur,
        show_in_info:true,
    }
    dm.addData([tspell,eff,onDmgEoc,dt,genDIO(dt),exteff], "damage_type", did);
}

//撕裂
export async function Laceration(dm:DataManager){
    const did = "Laceration" as DamageTypeID;
    const tspell:Spell={
        type:"SPELL",
        id:EMDef.genSpellID(`${did}_Trigger`),
        name:"撕裂创伤触发伤害",
        description:"撕裂创伤触发伤害",
        effect:"attack",
        min_damage:{math:[`u_effect_intensity('${did}') * tmpLacerationDmg`]},
        max_damage:MAX_NUM,
        valid_targets:["self"],
        shape:"blast",
        damage_type:"stab",
    }
    const onDmgEoc:Eoc={
        type:"effect_on_condition",
        eoc_type:"ACTIVATION",
        id:EMDef.genEocID(`${did}_OnDamage`),
        effect:[
            //regenDmg,
            {u_message:"撕裂触发 <context_val:total_damage> <context_val:damage_taken>"},
            {math:["tmpLacerationDmg","=","_total_damage/10"]},
            {npc_cast_spell:{id:tspell.id,hit_self:true}},
        ],
        condition:{math:["_total_damage",">","0"]}
    }
    const dt:DamageType = {
        id: did,
        type: "damage_type",
        name: "撕裂",
        magic_color: "white",
        ondamage_eocs: [ onDmgEoc.id ],
        no_resist:true,
    }
    dm.addData([onDmgEoc,dt,tspell,genDIO(dt)], "damage_type", did);
}