import { DataManager } from "cdda-event";
import { EnchData } from "../EnchInterface";
export declare const KnockbackEID = "Knockback";
export declare const KnockbackMaxLvl = 5;
export declare function Knockback(dm: DataManager): Promise<EnchData>;
