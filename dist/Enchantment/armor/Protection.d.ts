import { DataManager } from "cdda-event";
import { EnchData } from "../EnchInterface";
export declare const ProtectionEID = "Protection";
export declare const ProtectionMaxLvl = 5;
export declare function Protection(dm: DataManager): Promise<EnchData>;
