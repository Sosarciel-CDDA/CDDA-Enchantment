import { DataManager } from "cdda-event";
import { EnchSet } from "./EnchInterface";
import { JObject } from "@zwa73/utils";
import { EocID, Flag, Generic } from "cdda-schema";
import { EMDef } from "@src/EMDefine";



/**子eoc */
function enchEID(flag:Flag,t:"add"|"remove"){
    return `${flag.id}_${t}` as EocID;
}



export async function debugItem(dm:DataManager,enchSets:EnchSet[]){
    const out:JObject[] = [];

    //展开附魔集等级标志
    const flatEnchSet:Flag[] = [];
    enchSets.forEach((enchset)=>
        enchset.lvl.forEach((lvlobj)=>
            flatEnchSet.push(lvlobj.ench)
        )
    )

    const NONEEocId = "EnchTestNone" as EocID;

    const enchTestList = [
        [EMDef.genActEoc("EnchTestAdd",[{
            run_eoc_selector:[...flatEnchSet.map((ench)=>enchEID(ench,"add")),NONEEocId],
            names:[...flatEnchSet.map((ench)=>ench.name as string),"算了"],
            hide_failing:true
        }]),"添加附魔"],
        [EMDef.genActEoc("EnchTestRemove",[{
            run_eoc_selector:[...flatEnchSet.map((ench)=>enchEID(ench,"remove")),NONEEocId],
            names:[...flatEnchSet.map((ench)=>ench.name as string),"算了"],
            hide_failing:true
        }]),"移除附魔"],
        [EMDef.genActEoc(NONEEocId,[],undefined,true),"取消调试"],
    ] as const;
    out.push(...enchTestList.map((item)=>item[0]));


    //添加附魔子eoc
    enchSets.forEach((enchset)=>{
        enchset.lvl.forEach((lvlobj)=>{
            out.push(EMDef.genActEoc(enchEID(lvlobj.ench,"add"),[
                {npc_set_flag:lvlobj.ench.id},
                {npc_set_flag:enchset.main.id}
            ],{not:{npc_has_flag:enchset.main.id}},true));
        });
    })
    //移除附魔子eoc
    enchSets.forEach((enchset)=>{
        enchset.lvl.forEach((lvlobj)=>{
            out.push(EMDef.genActEoc(enchEID(lvlobj.ench,"remove"),[
                {npc_unset_flag:lvlobj.ench.id},
                {npc_unset_flag:enchset.main.id}
            ],{npc_has_flag:lvlobj.ench.id},true));
        });
    })

    const EnchTestTool:Generic = {
        id:EMDef.genGenericID("EnchTestTool"),
        type:"GENERIC",
        name:{str_sp:"附魔调试工具"},
        description:"附魔调试工具",
        weight:0,
        volume:0,
        symbol:"o",
        flags:["ZERO_WEIGHT","UNBREAKABLE"],
        use_action:{
            type:"effect_on_conditions",
            description:"附魔调试",
            menu_text:"附魔调试",
            effect_on_conditions:[{
                eoc_type:"ACTIVATION",
                id:EMDef.genEOCID("EnchTestTool"),
                effect:[{
                    u_run_inv_eocs:"manual",
                    title:"选择需要调试的物品",
                    true_eocs:{
                        id:"EnchTestTool_SelectType" as EocID,
                        eoc_type:"ACTIVATION",
                        effect:[{
                            run_eoc_selector:enchTestList.map((item)=>item[0].id),
                            names:enchTestList.map((item)=>item[1]),
                            title:"选择选择调试类型"
                        }]
                    }
                }]
            }]
        }
    }
    out.push(EnchTestTool);

    dm.addStaticData(out,"EnchTest");
}