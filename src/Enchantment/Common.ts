import { DataManager } from "cdda-event";
import { EnchData, VaildEnchCategoryList } from "./EnchInterface";
import { JObject } from "@zwa73/utils";
import { EMDef } from "@src/EMDefine";
import { AnyObj, EocEffect, EocID, Flag } from "cdda-schema";



/**通用eoc的id */
export function enchEID(flag:Flag,t:"add"|"remove"){
    return EMDef.genEOCID(`${flag.id}_${t}`);
}
/**附魔强度id */
export function enchInsVar(ench:EnchData,t:"u"|"n"){
    return `${t}_${ench.id}`;
}

/**随机鉴定EocID */
export const IDENTIFY_EOC_ID = EMDef.genEOCID("IdentifyEnch");
/**刷新附魔缓存EocID */
export const UPGRADE_ENCH_CACHE_EOC_ID = EMDef.genEOCID("UpgradeEnchCache");
/**初始化附魔数据 */
export const INIT_ENCH_DATA_EOC_ID = EMDef.genEOCID("InitEnchData");

export async function prepareProc(dm:DataManager,enchDataList:EnchData[]) {
    const out:JObject[]=[];

    //展开附魔集等级标志
    const enchFlagList:Flag[] = [];
    enchDataList.forEach((enchset)=>
        enchset.lvl.forEach((lvlobj)=>
            enchFlagList.push(lvlobj.ench)
        )
    )

    //辅助eoc
    //添加附魔子eoc
    enchDataList.forEach((data)=>{
        data.lvl.forEach((lvlobj)=>{
            out.push(EMDef.genActEoc(enchEID(lvlobj.ench,"add"),[
                {npc_set_flag:lvlobj.ench.id},
                {npc_set_flag:data.main.id}
            ],{and:[
                //排除冲突
                {not:{or:[
                    ...(lvlobj.ench.conflicts??[])
                        .map((id)=>({npc_has_flag:id})),
                    {npc_has_flag:lvlobj.ench.id},
                ]}},
                //符合类型
                {or:[
                    ...(data.category.map((t)=>({
                        compare_string:[t,{npc_val:"enchCategory"}] as [string,AnyObj]
                    })))
                ]}
            ]},true));
        });
    })

    //{not:{npc_has_flag:enchset.main.id}}
    //移除附魔子eoc
    enchDataList.forEach((data)=>{
        data.lvl.forEach((lvlobj)=>{
            out.push(EMDef.genActEoc(enchEID(lvlobj.ench,"remove"),[
                {npc_unset_flag:lvlobj.ench.id},
                {npc_unset_flag:data.main.id}
            ],{npc_has_flag:lvlobj.ench.id},true));
        });
    })

    //鉴定附魔Eoc
    const enchPointMax  = 10;//最大点数
    const eachMax       = 10;//最大尝试次数
    const enchChange    = 2 ;//附魔one_in概率
    const weightSum     = enchDataList.reduce((enchsum,ench)=>
        enchsum + ench.lvl.reduce((lvlobjsum,lvlobj)=>
            lvlobj.weight + lvlobjsum, 0), 0);//总附魔权重
    const noneWeight   = weightSum/10;//空附魔权重
    const weightList:[EocID,number][] = [];
    const subeocid = EMDef.genEOCID('IdentifyEnch_each');
    const identifyEnchEoc = EMDef.genActEoc(IDENTIFY_EOC_ID,[
        {if:{one_in_chance:enchChange},
        then:[
            {math:["_eachCount","=",`${eachMax}`]},
            {run_eocs:EMDef.genActEoc(subeocid,[
                {weighted_list_eocs:weightList},
                {math:["_eachCount","-=","1"]},
                {run_eocs:subeocid}
            ],{and:[
                {math:["_eachCount",">",`0`]},
                {math:["n_enchPoint","<",`${enchPointMax}`]}
            ]},true)},
        ]},
        {math:["n_isIdentifyEnch","=","1"]}
    ],{math:["n_isIdentifyEnch","!=","1"]},true);
    const noneEnchEoc = EMDef.genActEoc("NoneEnch",[]);
    enchDataList.forEach((ench)=>
        ench.lvl.forEach((lvlobj)=>
            weightList.push([enchEID(lvlobj.ench,"add"),lvlobj.weight])))
    weightList.push([noneEnchEoc.id,noneWeight]);
    out.push(identifyEnchEoc,noneEnchEoc);


    //累计附魔缓存
    const sumCacheEffects:EocEffect[] = [];
    enchDataList.forEach((ench)=>{
        ench.lvl.forEach((lvlobj)=>
            sumCacheEffects.push({
                if:{npc_has_flag:lvlobj.ench.id},
                then:[{math:[enchInsVar(ench,"n"),"+=",`${lvlobj.intensity}`]}]
            }))
    })
    const sumCacheEoc = EMDef.genActEoc("SumEnchCache",sumCacheEffects);
    out.push(sumCacheEoc);
    //清理附魔缓存
    const clearCacheEoc = EMDef.genActEoc("ClearEnchCache",
        enchDataList.map((ench)=>({math:[enchInsVar(ench,"n"),"=","0"]}))
    );
    out.push(clearCacheEoc);
    //刷新附魔缓存eoc
    const upgradeEnchCache = EMDef.genActEoc(UPGRADE_ENCH_CACHE_EOC_ID,[
        {run_eocs:clearCacheEoc.id},
        {u_run_inv_eocs:"all",
        search_data:[{worn_only:true},{wielded_only:true}],
        true_eocs:sumCacheEoc.id}
    ],undefined,true);
    out.push(upgradeEnchCache);
    dm.addInvokeEoc("WearItem",0,upgradeEnchCache);
    dm.addInvokeEoc("WieldItem",0,upgradeEnchCache);
    dm.addInvokeEoc("SlowUpdate",0,upgradeEnchCache);

    //初始化附魔数据
    const initeffects:EocEffect[] = (VaildEnchCategoryList.map((t)=>({
        u_run_inv_eocs:"all",
        search_data:[{category:t}],
        true_eocs:{
            id:EMDef.genEOCID(`initEnchData_${t}`),
            eoc_type:"ACTIVATION",
            effect:[{npc_add_var:"enchCategory",value:t}]
        }
    })))
    const initEnchData = EMDef.genActEoc(INIT_ENCH_DATA_EOC_ID,[
        ...initeffects
    ],undefined,true);
    out.push(initEnchData);

    dm.addStaticData(out,"Common");
    return enchFlagList;
}