import { DataManager } from "cdda-event";
import { EnchData } from "./EnchInterface";
import { JObject } from "@zwa73/utils";
import { EMDef } from "@src/EMDefine";
import { EocID, Flag } from "cdda-schema";



/**通用eoc的id */
export function enchEID(flag:Flag,t:"add"|"remove"){
    return EMDef.genEOCID(`${flag.id}_${t}`);
}

export async function prepareProc(dm:DataManager,enchDataList:EnchData[]) {
    const out:JObject[]=[];
    //辅助eoc
    //添加附魔子eoc
    enchDataList.forEach((enchset)=>{
        enchset.lvl.forEach((lvlobj)=>{
            out.push(EMDef.genActEoc(enchEID(lvlobj.ench,"add"),[
                {npc_set_flag:lvlobj.ench.id},
                {npc_set_flag:enchset.main.id}
            ],{not:{
                or:(lvlobj.ench.conflicts??[])
                    .map((id)=>({npc_has_flag:id}))
            }},true));
        });
    })
    //{not:{npc_has_flag:enchset.main.id}}
    //移除附魔子eoc
    enchDataList.forEach((enchset)=>{
        enchset.lvl.forEach((lvlobj)=>{
            out.push(EMDef.genActEoc(enchEID(lvlobj.ench,"remove"),[
                {npc_unset_flag:lvlobj.ench.id},
                {npc_unset_flag:enchset.main.id}
            ],{npc_has_flag:lvlobj.ench.id},true));
        });
    })
    dm.addStaticData(out,"Common");

    //展开附魔集等级标志
    const flatEnchSet:Flag[] = [];
    enchDataList.forEach((enchset)=>
        enchset.lvl.forEach((lvlobj)=>
            flatEnchSet.push(lvlobj.ench)
        )
    )
    return flatEnchSet;
}