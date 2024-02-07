import { DataManager } from "cdda-event";
import { EnchData } from "./EnchInterface";
import { EocID, Flag, FlagID } from "cdda-schema";
/**默认的最大附魔点数 */
export declare const MAX_ENCH_POINT = 100;
/**最大附魔尝试次数 */
export declare const MAX_ENCH_COUNT = 10;
/**附魔物品生成 one_in 概率 */
export declare const ENCH_ONE_IN = 2;
/**表示物品完成附魔初始化 */
export declare const N_COMPLETE_ENCH_INIT = "n_completedEnchInit";
/**表示物品附魔点数的变量 */
export declare const N_ENCH_POINT = "n_enchPoint";
/**表述物品的最大附魔点数 需初始化 */
export declare const N_ENCH_POINT_MAX = "n_enchPointMax";
/**表示物品的附魔类型 需初始化 */
export declare const ITEM_ENCH_TYPE = "itemEnchType";
/**表示物品是被诅咒的 需鉴定 */
export declare const IS_CURSED_FLAG_ID: FlagID;
/**表示物品是被鉴定过的 需鉴定 */
export declare const IS_IDENTIFYED_FLAG_ID: FlagID;
/**表示物品是含有附魔 需鉴定 */
export declare const IS_ENCHED_FLAG_ID: FlagID;
/**辅助eoc的id 对 beta 增减某个附魔 */
export declare function auxEID(flag: Flag | FlagID, t: "add" | "remove"): EocID;
/**附魔强度id */
export declare function enchInsVar(ench: EnchData, t: "u" | "n"): string;
/**附魔的等级flagID */
export declare function enchLvlID(baseID: string, lvl: number): FlagID;
/**鉴定EocID
 * 对 beta 进行鉴定
 * 随机添加附魔
 * u为角色 n为物品
 */
export declare const IDENTIFY_EOC_ID: EocID;
/**刷新附魔缓存EocID
 * u为角色 n不存在
 */
export declare const UPGRADE_ENCH_CACHE_EOC_ID: EocID;
/**初始化附魔数据
 * 在尝试添加附魔前需运行
 * u为角色 n不存在
 */
export declare const INIT_ENCH_DATA_EOC_ID: EocID;
/**移除诅咒EocID */
export declare const REMOVE_CURSE_EOC_ID: EocID;
export declare function prepareProc(dm: DataManager, enchDataList: EnchData[]): Promise<void>;
/**展开附魔等级变体flag */
export declare function flatEnchFlag(enchDataList: EnchData[]): Promise<Flag[]>;
