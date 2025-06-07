import { DataManager } from "@sosarciel-cdda/event";
import { JObject } from "@zwa73/utils";
import { EocID, Flag, Generic } from "@sosarciel-cdda/schema";
import { EMDef } from "@src/EMDefine";
import { INIT_ENCH_DATA_EOC_ID, auxEID } from "./Common";



export async function debugItem(dm:DataManager,enchFlagList:Flag[]){
    const out:JObject[] = [];
    const NONEEocId = "EnchTestNone" as EocID;

    const enchTestList = [
        [EMDef.genActEoc("EnchTestAdd",[{run_eocs:INIT_ENCH_DATA_EOC_ID},{
            run_eoc_selector:[...enchFlagList.map((ench)=>auxEID(ench,"add")),NONEEocId],
            names:[...enchFlagList.map((ench)=>ench.name as string),"算了"],
            hide_failing:true
        }]),"添加附魔"],
        [EMDef.genActEoc("EnchTestRemove",[{
            run_eoc_selector:[...enchFlagList.map((ench)=>auxEID(ench,"remove")),NONEEocId],
            names:[...enchFlagList.map((ench)=>ench.name as string),"算了"],
            hide_failing:true
        }]),"移除附魔"],
        [EMDef.genActEoc(NONEEocId,[],undefined,true),"取消调试"],
    ] as const;
    out.push(...enchTestList.map((item)=>item[0]));

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

    dm.addData(out,"EnchTest");
}