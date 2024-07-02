import { DamageType, DamageTypeID, Effect, EffectID, Eoc, Flag, FlagID, Spell } from "cdda-schema";
import { CON_SPELL_FLAG, EMDef, MAX_NUM } from "@src/EMDefine";
import { DataManager } from "cdda-event";
import { JObject } from "@zwa73/utils";
import { genBaseConfilcts, genEnchConfilcts, genEnchInfo, genEnchPrefix, genMainFlag, genWieldTrigger, numToRoman } from "../UtilGener";
import { EnchData } from "../EnchInterface";
import { enchLvlID } from "../Common";
import { FragileEID, FragileMaxLvl } from "./Fragile";


export const ProtectionEID = "Protection";
export const ProtectionMaxLvl = 5;
export async function Protection(dm:DataManager) {
    const enchName = "保护";
    const out:JObject[]=[];

    //被动效果
    const effid = EMDef.genEffectID(ProtectionEID);
    const enchEffect:Effect = {
        type:"effect_type",
        id:effid,
        name:[`${enchName} 附魔效果`],
        desc:[`${enchName} 附魔正在生效 每层效果提供 5% 物理伤害减免`],
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
    const enchData:EnchData={
        id:ProtectionEID,
        main:genMainFlag(ProtectionEID,enchName),
        intensity_effect: [enchEffect.id],
        ench_type:["armor"],
        lvl:[]
    };
    out.push(enchData.main);
    //构造等级变体
    for(let i=1;i<=ProtectionMaxLvl;i++){
        const subName = `${enchName} ${numToRoman(i)}`;
        //变体ID
        const ench:Flag = {
            type:"json_flag",
            id:enchLvlID(ProtectionEID,i),
            name:subName,
            info:genEnchInfo("good",subName,`这件物品可以降低 ${i*5}% 所受到的物理伤害`),
            item_prefix:genEnchPrefix('good',subName),
        };
        //加入输出
        out.push(ench);
        enchData.lvl.push({
            ench,
            weight:ProtectionMaxLvl+1-i,
            intensity:i,
            point:i*10,
        });
    }

    //互斥附魔flag
    genBaseConfilcts(enchData);
    genEnchConfilcts(enchData,FragileEID,FragileMaxLvl);
    dm.addData(out,"ench",ProtectionEID);
    return enchData;
}