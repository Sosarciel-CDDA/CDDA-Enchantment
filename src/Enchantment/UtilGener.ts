import { EMDef } from "@src/EMDefine";
import { CharHook, DataManager } from "cdda-event";
import { BoolObj, EocEffect, FlagID } from "cdda-schema";
import { EnchData } from "./EnchInterface";



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
export function baseConfilcts(enchData:EnchData){
    enchData.lvl.forEach((lvlobj)=>{
        const ench = lvlobj.ench;
        ench.conflicts = ench.conflicts??[];
        ench.conflicts.push(...enchData.lvl
            .filter((sublvlobj)=>sublvlobj.ench.id!=ench.id)
            .map((subelvlobj)=>subelvlobj.ench.id))
    })
}