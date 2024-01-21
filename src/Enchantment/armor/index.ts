import { DataManager } from "cdda-event";
import { Protection } from "./Protection";



export async function armorEnch(dm:DataManager){
    return await Promise.all([
        await Protection(dm),
    ])
}