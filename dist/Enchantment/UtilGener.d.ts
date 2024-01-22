import { CharHook, DataManager } from "cdda-event";
import { BoolObj, Color, EocEffect, Flag, FlagID, MessageRatType } from "cdda-schema";
import { EnchData } from "./EnchInterface";
/**手持触发 */
export declare function genWieldTrigger(dm: DataManager, flagId: FlagID, hook: CharHook, effects: EocEffect[], condition?: BoolObj): import("cdda-schema").Eoc;
export declare function numToRoman(num: number): string;
/**添加同附魔lvl变体的基础互斥 */
export declare function genBaseConfilcts(enchData: EnchData): void;
/**根据ID与最大等级添加附魔互斥 */
export declare function genEnchConfilcts(enchData: EnchData, baseID: string, maxLvl: number): void;
/**生成主附魔flag */
export declare function genMainFlag(enchId: string, enchName: string): Flag;
/**生成附魔说明 */
export declare function genEnchInfo(color: Color | MessageRatType, name: string, desc: string): string;
