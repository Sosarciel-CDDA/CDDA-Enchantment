import { DataManager } from "cdda-event";
import { EnchSet } from "./EnchInterface";
import { knockback as Knockback } from "./Knockback";
import { debugItem } from "./DebugItem";




export async function createEnchantment(dm:DataManager){
    const EnchList:EnchSet[] = [
        await Knockback(dm),
    ];
    await debugItem(dm,EnchList);
}