import { DataManager } from "cdda-event";
import { EnchData, VaildEnchCategory, VaildEnchCategoryList } from "./EnchInterface";
import { JObject } from "@zwa73/utils";
import { EMDef } from "@src/EMDefine";
import { AnyObj, BoolObj, EocEffect, EocID, Flag, NumObj } from "cdda-schema";



/**默认的最大附魔点数 */
export const MAX_ENCH_POINT = 100;
/**最大附魔尝试次数 */
export const MAX_ENCH_COUNT = 10;
/**附魔物品生成 one_in 概率 */
export const ENCH_ONE_IN    = 10;


/**通用eoc的id */
export function enchEID(flag:Flag,t:"add"|"remove"){
    return EMDef.genEOCID(`${flag.id}_${t}`);
}
/**附魔强度id */
export function enchInsVar(ench:EnchData,t:"u"|"n"){
    return `${t}_${ench.id}`;
}

/**随机鉴定EocID  
 * u为角色 n为物品  
 */
export const IDENTIFY_EOC_ID = EMDef.genEOCID("IdentifyEnch");
/**刷新附魔缓存EocID  
 * u为角色 n不存在  
 */
export const UPGRADE_ENCH_CACHE_EOC_ID = EMDef.genEOCID("UpgradeEnchCache");
/**初始化附魔数据  
 * 在尝试添加附魔前需运行  
 * u为角色 n不存在  
 */
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
                {npc_set_flag:data.main.id},
                {math:["n_enchPoint","+=",`${lvlobj.point}`]}
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
                        npc_has_var: "enchCategory",
                        value: t,
                    })))
                ]},
                //排除自体护甲与生化武器
                {not:{or:[
                    {npc_has_flag:"BIONIC_WEAPON"   },//生化武器
                    {npc_has_flag:"INTEGRATED"      },//自体护甲
                ]}}
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
    const weightSum = enchDataList.reduce((enchsum,ench)=>
        enchsum + ench.lvl.reduce((lvlobjsum,lvlobj)=>
            lvlobj.weight + lvlobjsum, 0), 0);//总附魔权重
    const noneWeight   = weightSum/10;//空附魔权重
    const weightListMap:Record<VaildEnchCategory,[EocID,NumObj][]> = {
        "armor":[],
        "weapons":[]
    };
    const identifyCond:BoolObj = {and:[
        {math:["n_isIdentifyEnch","!=","1"]},
        {or:VaildEnchCategoryList.map((cate)=>({npc_has_var:"enchCategory",value:cate}))}
    ]}
    const subeocid = EMDef.genEOCID('IdentifyEnch_each');
    const identifyEnchEoc = EMDef.genActEoc(IDENTIFY_EOC_ID,[
        {if:{one_in_chance:ENCH_ONE_IN},
        then:[
            {math:["_eachCount","=",`${MAX_ENCH_COUNT}`]},
            ...(VaildEnchCategoryList.map((cate)=>{
                const eff:EocEffect = {run_eocs:{
                    id:`${subeocid}_${cate}` as EocID,
                    eoc_type:"ACTIVATION",
                    effect:[
                        {weighted_list_eocs:weightListMap[cate]},
                        {math:["_eachCount","-=","1"]},
                        {run_eocs:`${subeocid}_${cate}` as EocID}
                    ],
                    condition:{and:[
                        {math:["_eachCount",">",`0`]},
                        {math:["n_enchPoint","<",`${MAX_ENCH_POINT}`]}
                    ]}
                }}
                return eff;
            })),
            {u_message:"你从一件装备上发现了附魔",type:"good"},
        ]},
        {u_message:"一件装备的详细属性被揭示了",type:"good"},
        {math:["n_isIdentifyEnch","=","1"]},
    ],identifyCond,true);
    const noneEnchEoc = EMDef.genActEoc("NoneEnch",[]);

    for(const enchCate of VaildEnchCategoryList){
        enchDataList.forEach((ench)=>{
            const wlist = weightListMap[enchCate];
            if(ench.category.includes(enchCate)){
                ench.lvl.forEach((lvlobj)=>
                    wlist.push([enchEID(lvlobj.ench,"add"),{math:[`${lvlobj.weight}`]}]))
                wlist.push([noneEnchEoc.id,{math:[`${noneWeight}`]}]);
            }
        })
    }
    out.push(identifyEnchEoc,noneEnchEoc);

    //累计附魔缓存
    const sumCacheEffects:EocEffect[] = [];
    enchDataList.forEach((ench)=>{
        ench.lvl.forEach((lvlobj)=>{
            if(lvlobj.intensity!=null){
                sumCacheEffects.push({
                    if:{npc_has_flag:lvlobj.ench.id},
                    then:[{math:[enchInsVar(ench,"u"),"+=",`${lvlobj.intensity}`]}]
                })
            }
        })
    })
    const sumCacheEoc = EMDef.genActEoc("SumEnchCache",[
        //{u_message:"sumCacheEffects"},
        ...sumCacheEffects
    ]);
    out.push(sumCacheEoc);
    //清理附魔缓存
    const clearCacheEoc = EMDef.genActEoc("ClearEnchCache",
        enchDataList.map((ench)=>({math:[enchInsVar(ench,"u"),"=","0"]}))
    );
    out.push(clearCacheEoc);
    //刷新附魔缓存eoc
    const upgradeEnchCache = EMDef.genActEoc(UPGRADE_ENCH_CACHE_EOC_ID,[
        {run_eocs:clearCacheEoc.id},
        {u_run_inv_eocs:"all",
        search_data:[{wielded_only:true},{worn_only:true}],
        true_eocs:sumCacheEoc.id},
    ],undefined,true);
    dm.addInvokeEoc("WearItem"    ,1,upgradeEnchCache);
    dm.addInvokeEoc("WieldItemRaw",1,upgradeEnchCache);
    dm.addInvokeEoc("SlowUpdate"  ,1,upgradeEnchCache);
    out.push(upgradeEnchCache);

    //初始化附魔数据
    const initeffects:EocEffect[] = (VaildEnchCategoryList.map((t)=>({
        u_run_inv_eocs:"all",
        search_data:[{category:t}],
        true_eocs:{
            id:EMDef.genEOCID(`initEnchData_${t}`),
            eoc_type:"ACTIVATION",
            effect:[
                {npc_add_var:"enchCategory",value:t}
            ]
        }
    })))
    const initEnchData = EMDef.genActEoc(INIT_ENCH_DATA_EOC_ID,[
        ...initeffects
    ],undefined,true);
    out.push(initEnchData);

    //根据缓存添加效果
    enchDataList.forEach((ench)=>{
        if(ench.effect!=null){
            const eff = ench.effect;
            //触发eoc
            const teoc = EMDef.genActEoc(`${ench.id}_AddEffect`,[
                {if:{math:[enchInsVar(ench,"u"),">=","1"]},
                then:[
                    //{u_message:ench.id},
                    {u_add_effect:eff.id,intensity:{math:[enchInsVar(ench,"u")]},duration:"PERMANENT"}
                ],
                else:[{u_lose_effect:eff.id}]}
            ]);
            dm.addInvokeEoc("WearItem"    ,0,teoc);
            dm.addInvokeEoc("WieldItemRaw",0,teoc);
            dm.addInvokeEoc("SlowUpdate"  ,0,teoc);
            out.push(teoc);
        }
    })

    //鉴定穿戴的物品
    const identifyWear = EMDef.genActEoc("IdentifyEnch_Wear",[
        {run_eocs:[INIT_ENCH_DATA_EOC_ID,IDENTIFY_EOC_ID]},
    ],{math:["n_isIdentifyEnch","!=","1"]})
    dm.addInvokeEoc("WearItem" ,2,identifyWear);
    dm.addInvokeEoc("WieldItem",2,identifyWear);
    out.push(identifyWear);

    dm.addStaticData(out,"Common");
    return enchFlagList;
}