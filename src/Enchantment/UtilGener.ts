import { EMDef } from "@src/EMDefine";
import { CharHook, DataManager } from "cdda-event";
import { BoolObj, Color, ColorList, EocEffect, Flag, FlagID, MessageRatType } from "@sosarciel-cdda/sclema";
import { EnchData } from "./EnchInterface";
import { enchLvlID } from "./Common";



/**手持触发 */
export function genWieldTrigger(dm:DataManager,flagId:FlagID,hook:CharHook,effects:EocEffect[],condition?:BoolObj){
    const eoc = EMDef.genActEoc(`${flagId}_WieldTigger`,effects,{and:[
        {u_has_wielded_with_flag:flagId},
        ...(condition ? [condition] : [])
    ]});
    dm.addInvokeEoc(hook,0,eoc);
    return eoc;
}

export function numToRoman(num:number) {
    const romanNumerals = {
        M : 1000,
        CM: 900 ,
        D : 500 ,
        CD: 400 ,
        C : 100 ,
        XC: 90  ,
        L : 50  ,
        XL: 40  ,
        X : 10  ,
        IX: 9   ,
        V : 5   ,
        IV: 4   ,
        I : 1   ,
    } as const;
    let roman = '';
    for (let key in romanNumerals) {
        const fixk = key as (keyof typeof romanNumerals)
        while (num >= romanNumerals[fixk]) {
            roman += key;
            num -= romanNumerals[fixk];
        }
    }
    return roman;
}

/**添加同附魔lvl变体的基础互斥 */
export function genBaseConfilcts(enchData:EnchData){
    enchData.lvl.forEach((lvlobj)=>{
        const ench = lvlobj.ench;
        ench.conflicts = ench.conflicts??[];
        ench.conflicts.push(...enchData.lvl
            .filter((sublvlobj)=>sublvlobj.ench.id!=ench.id)
            .map((subelvlobj)=>subelvlobj.ench.id))
    })
}
/**根据ID与最大等级添加附魔互斥 */
export function genEnchConfilcts(enchData:EnchData,baseID:string,maxLvl:number){
    enchData.lvl.forEach((lvlobj)=>{
        const ench = lvlobj.ench;
        ench.conflicts = ench.conflicts??[];
        for(let lvl=1;lvl<=maxLvl;lvl++)
            ench.conflicts.push(enchLvlID(baseID,lvl))
    })
}

/**生成主附魔flag */
export function genMainFlag(enchId:string,enchName:string):Flag{
    return {
        type:"json_flag",
        id:EMDef.genFlagID(`${enchId}_Main_Ench`),
        name:enchName,
    }
}

/**生成附魔说明 */
export function genEnchInfo(color:Color|"good"|"bad",name:string,desc:string){
    if(ColorList.includes(color as Color))
        return `<color_${color}>[${name}]</color> ${desc}`;
    return `<${color}>[${name}]</${color}> ${desc}`;
}

/**生成附魔前缀 */
export function genEnchPrefix(color:Color|"good"|"bad",name:string){
    if(ColorList.includes(color as Color))
        return `<color_${color}>[${name}]</color> `;
    return `<${color}>[${name}]</${color}> `;
}