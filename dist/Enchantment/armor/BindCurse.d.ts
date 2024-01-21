import { FlagID } from "cdda-schema";
import { DataManager } from "cdda-event";
import { EnchData } from "../EnchInterface";
export declare const BindCurseEID = "BindCurse";
export declare const BindCurseLvlFlagId: FlagID;
export declare function BindCurse(dm: DataManager): Promise<EnchData>;
