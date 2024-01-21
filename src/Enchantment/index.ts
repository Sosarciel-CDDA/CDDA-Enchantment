import { DataManager } from "cdda-event";
import { EnchData } from "./EnchInterface";
import { debugItem } from "./DebugItem";
import { prepareProc } from "./Common";
import { weaponsEnch } from "./weapons";
import { armorEnch } from "./armor";
import { identifySpell } from "./IdentifySpell";




export async function createEnchantment(dm:DataManager){
    const enchDataList:EnchData[] = await Promise.all([
        ... await weaponsEnch(dm)   ,
        ... await armorEnch(dm)     ,
    ]);
    //预处理并展开附魔flag
    const enchFlagList = await prepareProc(dm,enchDataList);
    //生成调试道具
    await debugItem(dm,enchFlagList);
    await identifySpell(dm);
}