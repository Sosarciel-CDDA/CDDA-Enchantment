import { ModDefine } from "@sosarciel-cdda/schema";


/**mod物品前缀 */
export const MOD_PREFIX = "CENCH";

export const EMDef = new ModDefine(MOD_PREFIX);

/**默认的最大数值 */
export const MAX_NUM = 1000000;

/**用于必定成功的控制法术的flags */
export const CON_SPELL_FLAG = ["SILENT", "NO_HANDS", "NO_LEGS", "NO_FAIL","NO_EXPLOSION_SFX"] as const;
