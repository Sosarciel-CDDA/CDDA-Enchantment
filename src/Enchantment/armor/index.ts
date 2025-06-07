import { DataManager } from "@sosarciel-cdda/event";
import { Protection } from "./Protection";
import { BindCurse } from "./BindCurse";
import { Fragile } from "./Fragile";



export async function armorEnch(dm:DataManager){
    return await Promise.all([
        await Protection(dm),
        await Fragile(dm)   ,
        await BindCurse(dm) ,
    ])
}