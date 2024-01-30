import { DamageType, DamageTypeID, Effect, EffectID, Eoc, Spell } from "cdda-schema";
import { genDIO } from "./UtilGener";
import { EMDef, MAX_NUM } from "@src/EMDefine";
import { DataManager } from "cdda-event";

//冻结
export async function Freeze(dm:DataManager){
    const did = "Freeze" as DamageTypeID;
    const dname = "冻结";
    const tspell:Spell={
        type:"SPELL",
        id:EMDef.genSpellID(`${did}_Trigger`),
        name:"冻结触发",
        description:"冻结触发",
        effect:"mod_moves",
        min_damage:{math:[`tmp${did}Dmg`]},
        max_damage:MAX_NUM,
        valid_targets:["self"],
        shape:"blast"
    }
    const onDmgEoc:Eoc={
        type:"effect_on_condition",
        eoc_type:"ACTIVATION",
        id:EMDef.genEOCID(`${did}_OnDamage`),
        effect:[
            {u_message:`${dname} 触发 <context_val:total_damage> <context_val:damage_taken>`},
            {math:[`tmp${did}Dmg`,"=","0 - (_total_damage*100)"]},
            {npc_cast_spell:{id:tspell.id,hit_self:true}},
        ],
        condition:{math:["_total_damage",">","0"]}
    }
    const dt:DamageType = {
        id: did,
        type: "damage_type",
        name: dname,
        magic_color: "light_blue",
        ondamage_eocs: [ onDmgEoc.id ],
        no_resist:true
    }
    dm.addStaticData([onDmgEoc,dt,tspell,genDIO(dt)], "damage_type", did);
}