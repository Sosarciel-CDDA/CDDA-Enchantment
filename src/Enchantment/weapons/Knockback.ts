import { DamageType, DamageTypeID, Effect, EffectID, Eoc, Flag, FlagID, Spell } from "cdda-schema";
import { CON_SPELL_FLAG, EMDef, MAX_NUM } from "@src/EMDefine";
import { DataManager } from "cdda-event";
import { JObject } from "@zwa73/utils";
import { genBaseConfilcts, genEnchInfo, genMainFlag, genWieldTrigger, numToRoman } from "../UtilGener";
import { EnchData } from "../EnchInterface";
import { enchLvlID } from "../Common";


export const KnockbackEID = "Knockback";
export const KnockbackMaxLvl = 5;
export async function Knockback(dm:DataManager) {
    const enchName = "击退";
    const out:JObject[]=[];

    //构造附魔集
    const enchData:EnchData={
        id:KnockbackEID,
        main:genMainFlag(KnockbackEID,enchName),
        ench_type:["weapons"],
        lvl:[]
    };
    out.push(enchData.main);
    //构造等级变体
    for(let i=1;i<=KnockbackMaxLvl;i++){
        const subName = `${enchName} ${numToRoman(i)}`;
        //变体ID
        const ench:Flag = {
            type:"json_flag",
            id:enchLvlID(KnockbackEID,i),
            name:subName,
            info:genEnchInfo("mixed",subName,`这件物品可以造成 ${i} 点击退伤害`),
        };
        //触发法术
        const tspell:Spell = {
            id:EMDef.genSpellID(`${KnockbackEID}_${i}_Trigger`),
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
            {npc_location_variable:{global_val:`${KnockbackEID}_loc`}},
            {u_cast_spell:{id:tspell.id},loc:{global_val:`${KnockbackEID}_loc`}}
        ])
        //加入输出
        out.push(ench,tspell,teoc);
        enchData.lvl.push({
            ench,
            weight:KnockbackMaxLvl+1-i,
            point:i*2,
        });
    }
    //互斥附魔flag
    genBaseConfilcts(enchData);
    dm.addStaticData(out,"ench",KnockbackEID);
    return enchData;
}