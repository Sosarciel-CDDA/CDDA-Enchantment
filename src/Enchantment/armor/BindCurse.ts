import { Flag } from "@sosarciel-cdda/sclema";
import { DataManager } from "cdda-event";
import { JObject } from "@zwa73/utils";
import { genEnchInfo, genEnchPrefix, genMainFlag } from "../UtilGener";
import { EnchData } from "../EnchInterface";
import { enchLvlID } from "../Common";


export const BindCurseEID = "BindCurse";
export const BindCurseLvlFlagId = enchLvlID(BindCurseEID,1);
export async function BindCurse(dm:DataManager) {
    const enchName = "绑定诅咒";
    const out:JObject[]=[];

    //构造附魔集
    const enchData:EnchData={
        id:BindCurseEID,
        main:genMainFlag(BindCurseEID,enchName),
        ench_type:["armor"],
        lvl:[],
        is_curse:true
    };
    out.push(enchData.main);
    //构造等级变体
    //变体ID
    const ench:Flag = {
        type:"json_flag",
        id:BindCurseLvlFlagId,
        name:enchName,
        info:genEnchInfo("bad",enchName,`这件物品在移除诅咒前无法脱下`),
        item_prefix:genEnchPrefix('bad',enchName),
    };
    //加入输出
    out.push(ench);
    enchData.lvl.push({ench,
        add_effects:[
            {npc_set_flag:"INTEGRATED"},
            {u_message:"你从一件装备上发现了绑定诅咒",type:"bad"},
        ],
        remove_effects:[{npc_unset_flag:"INTEGRATED"}],
    });

    dm.addData(out,"ench",BindCurseEID);
    return enchData;
}