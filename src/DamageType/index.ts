import { DataManager } from "@sosarciel-cdda/event";
import { Discharge, Electrify } from "./Electrify";
import { Laceration, Trauma } from "./Trauma";
import { Freeze } from "./Freeze";
import { Knockback } from "./Knockback";

export async function createDamageType(dm:DataManager){
    await Electrify(dm);
    await Discharge(dm);
    await Trauma(dm);
    await Laceration(dm);
    await Freeze(dm);
    await Knockback(dm);
}









