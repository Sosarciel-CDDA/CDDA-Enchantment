import { DataManager } from "cdda-event";
import { EnchData } from "./EnchInterface";
import { EocID, Flag } from "cdda-schema";
/**通用eoc的id */
export declare function enchEID(flag: Flag, t: "add" | "remove"): EocID;
/**附魔强度id */
export declare function enchInsVar(ench: EnchData, t: "u" | "n"): string;
/**随机鉴定EocID */
export declare const IDENTIFY_EOC_ID: EocID;
/**刷新附魔缓存EocID */
export declare const UPGRADE_ENCH_CACHE_EOC_ID: EocID;
/**初始化附魔数据
 * 在尝试添加附魔前需运行
 */
export declare const INIT_ENCH_DATA_EOC_ID: EocID;
export declare function prepareProc(dm: DataManager, enchDataList: EnchData[]): Promise<Flag[]>;
