import { DamageType, DamageTypeID, Effect, EffectID, Eoc, Flag, FlagID, Spell } from "cdda-schema";
import { CON_SPELL_FLAG, EMDef } from "@src/EMDefine";
import { DataManager } from "cdda-event";
import { JObject } from "@zwa73/utils";
import { genBaseConfilcts, genEnchConfilcts, genEnchInfo, genEnchPrefix, genMainFlag, genWieldTrigger, numToRoman } from "../UtilGener";
import { EnchData } from "../EnchInterface";
import { auxEID, enchLvlID } from "../Common";
import { BindCurseEID, BindCurseLvlFlagId } from "./BindCurse";
import { ProtectionEID, ProtectionMaxLvl } from "./Protection";


export const FragileEID = "Fragile";
export const FragileMaxLvl = 5;
export async function Fragile(dm:DataManager) {
    const enchName = "脆弱";
    const out:JObject[]=[];

    //被动效果
    const effid = EMDef.genEffectID(FragileEID);
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
                multiply:{math:[`u_effect_intensity('${effid}') * 0.05`]},
            },{
                value:"ARMOR_CUT",
                multiply:{math:[`u_effect_intensity('${effid}') * 0.05`]},
            },{
                value:"ARMOR_STAB",
                multiply:{math:[`u_effect_intensity('${effid}') * 0.05`]},
            },{
                value:"ARMOR_BULLET",
                multiply:{math:[`u_effect_intensity('${effid}') * 0.05`]},
            }]
        }]
    }
    out.push(enchEffect);

    //构造附魔集
    const enchData:EnchData={
        id:FragileEID,
        main:genMainFlag(FragileEID,enchName),
        intensity_effect: [enchEffect.id],
        ench_type:["armor"],
        lvl:[],
        add_effects:[{run_eocs:auxEID(BindCurseLvlFlagId,"add")}],
        remove_effects:[{run_eocs:auxEID(BindCurseLvlFlagId,"remove")}]
    };
    out.push(enchData.main);
    //构造等级变体
    for(let i=1;i<=FragileMaxLvl;i++){
        const subName = `${enchName} ${numToRoman(i)}`;
        //变体ID
        const ench:Flag = {
            type:"json_flag",
            id:enchLvlID(FragileEID,i),
            name:subName,
            info:genEnchInfo("bad",subName,`这件物品会增加 ${i*5}% 所受到的物理伤害`),
            item_prefix:genEnchPrefix('bad',subName),
        };
        //加入输出
        out.push(ench);
        enchData.lvl.push({
            ench,
            weight:(FragileMaxLvl+1-i)/4,
            intensity:i,
        });
    }

    //互斥附魔flag
    genBaseConfilcts(enchData);
    genEnchConfilcts(enchData,ProtectionEID,ProtectionMaxLvl);
    dm.addData(out,"ench",FragileEID);
    return enchData;
}