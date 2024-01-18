import { DataManager } from "cdda-event";
import { EnchData } from "./EnchInterface";
import { Knockback } from "./Knockback";
import { debugItem } from "./DebugItem";
import { prepareProc } from "./Common";




export async function createEnchantment(dm:DataManager){
    const enchDataList:EnchData[] = [
        await Knockback(dm),
    ];
    //预处理并展开附魔flag
    const enchFlagList = await prepareProc(dm,enchDataList);
    //生成调试道具
    await debugItem(dm,enchFlagList);
}