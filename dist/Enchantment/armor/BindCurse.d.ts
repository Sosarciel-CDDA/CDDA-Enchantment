import { DataManager } from "cdda-event";
import { EnchData } from "../EnchInterface";
export declare const BindCurseEID = "BindCurse";
export declare const BindCurseLvlFlagId: import("cdda-schema").FlagID;
export declare function BindCurse(dm: DataManager): Promise<EnchData>;
