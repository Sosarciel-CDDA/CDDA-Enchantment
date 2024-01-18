import { CharHook, DataManager } from "cdda-event";
import { BoolObj, EocEffect, FlagID } from "cdda-schema";
/**手持触发 */
export declare function genWieldTrigger(dm: DataManager, flagId: FlagID, hook: CharHook, effects: EocEffect[], condition?: BoolObj): import("cdda-schema").Eoc;
export declare function numToRoman(num: number): string;
