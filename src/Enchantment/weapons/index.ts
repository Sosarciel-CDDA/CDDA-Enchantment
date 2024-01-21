import { DataManager } from "cdda-event";
import { Knockback } from "./Knockback";



export async function weaponsEnch(dm:DataManager){
    return await Promise.all([
        await Knockback(dm),
    ])
}