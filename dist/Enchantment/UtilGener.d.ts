import { CharHook, DataManager } from "cdda-event";
import { BoolObj, EocEffect, FlagID } from "cdda-schema";
import { EnchData } from "./EnchInterface";
/**手持触发 */
export declare function genWieldTrigger(dm: DataManager, flagId: FlagID, hook: CharHook, effects: EocEffect[], condition?: BoolObj): import("cdda-schema").Eoc;
export declare function numToRoman(num: number): string;
/**添加同附魔lvl变体的基础互斥 */
export declare function baseConfilcts(enchData: EnchData): void;
