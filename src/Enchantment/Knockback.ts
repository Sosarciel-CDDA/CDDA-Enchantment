import { DamageType, DamageTypeID, Effect, EffectID, Eoc, Flag, FlagID, Spell } from "cdda-schema";
import { CON_SPELL_FLAG, EMDef, SPELL_MAX_DAMAGE, TEFF_MAX } from "@src/EMDefine";
import { DataManager } from "cdda-event";
import { JObject } from "@zwa73/utils";
import { baseConfilcts, genWieldTrigger, numToRoman } from "./UtilGener";
import { EnchData } from "./EnchInterface";



export async function Knockback(dm:DataManager) {
    const enchName = "击退";
    const enchId = "Knockback";
    const maxLvl = 5;
    const out:JObject[]=[];

    //构造附魔集
    const mainench:Flag = {
        type:"json_flag",
        id:EMDef.genFlagID(`${enchId}_Ench`),
        name:enchName,
    };
    out.push(mainench);
    const enchData:EnchData={
        id:enchId,
        main:mainench,
        category:["weapons"],
        lvl:[]
    };
    //构造等级变体
    for(let i=1;i<=maxLvl;i++){
        const subid = `${enchId}_${i}`;
        const subName = `${enchName} ${numToRoman(i)}`;
        //变体ID
        const ench:Flag = {
            type:"json_flag",
            id:EMDef.genFlagID(`${subid}_Ench`),
            name:subName,
            info:`<color_white>[${subName}]</color> 这件物品可以造成 ${i} 点击退伤害`,
        };
        //触发法术
        const tspell:Spell = {
            id:EMDef.genSpellID(`${subid}_Trigger`),
            type:"SPELL",
            flags:[...CON_SPELL_FLAG],
            min_damage:i,
            max_damage:i,
            damage_type:"Knockback" as DamageTypeID,
            effect:"attack",
            shape:"blast",
            valid_targets:["ally","hostile","self"],
            name:`${subName} 附魔触发法术`,
            description: `${subName} 附魔触发法术`
        }
        //触发eoc
        const teoc = genWieldTrigger(dm,ench.id,"TryMeleeAttack",[
            {npc_location_variable:{global_val:`${enchId}_loc`}},
            {u_cast_spell:{id:tspell.id},loc:{global_val:`${enchId}_loc`}}
        ])
        //加入输出
        out.push(ench,tspell,teoc);
        enchData.lvl.push({
            ench,
            weight:maxLvl+1-i
        });
    }
    //互斥附魔flag
    baseConfilcts(enchData);
    dm.addStaticData(out,"ench",enchId);
    return enchData;
}