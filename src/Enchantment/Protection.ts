import { DamageType, DamageTypeID, Effect, EffectID, Eoc, Flag, FlagID, Spell } from "cdda-schema";
import { CON_SPELL_FLAG, EMDef, SPELL_MAX_DAMAGE, TEFF_MAX } from "@src/EMDefine";
import { DataManager } from "cdda-event";
import { JObject } from "@zwa73/utils";
import { baseConfilcts, genWieldTrigger, numToRoman } from "./UtilGener";
import { EnchData } from "./EnchInterface";
import { enchInsVar } from "./Common";



export async function Protection(dm:DataManager) {
    const enchName = "保护";
    const enchId = "Protection";
    const maxLvl = 5;
    const out:JObject[]=[];


    //被动效果
    const effid = EMDef.genEffectID(enchId);
    const enchEffect:Effect = {
        type:"effect_type",
        id:effid,
        name:[`${enchName} 附魔效果`],
        desc:[`${enchName} 附魔正在生效`],
        max_intensity:15,
        enchantments:[{
            condition:"ALWAYS",
            values:[{
                value:"ARMOR_BASH",
                multiply:{math:[`u_effect_intensity('${effid}') * -0.05`]},
            },{
                value:"ARMOR_CUT",
                multiply:{math:[`u_effect_intensity('${effid}') * -0.05`]},
            },{
                value:"ARMOR_STAB",
                multiply:{math:[`u_effect_intensity('${effid}') * -0.05`]},
            },{
                value:"ARMOR_BULLET",
                multiply:{math:[`u_effect_intensity('${effid}') * -0.05`]},
            }]
        }]
    }
    out.push(enchEffect);

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
        effect: enchEffect,
        category:["armor"],
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
            info:`<color_white>[${subName}]</color> 这件物品可以降低 ${i*5}% 的物理伤害`,
        };
        //加入输出
        out.push(ench);
        enchData.lvl.push({
            ench,
            weight:maxLvl+1-i,
            intensity:i
        });
    }

    //互斥附魔flag
    baseConfilcts(enchData);
    dm.addStaticData(out,"ench",enchId);
    return enchData;
}