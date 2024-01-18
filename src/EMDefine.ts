import { ModDefine } from "cdda-schema";


/**mod物品前缀 */
export const MOD_PREFIX = "CENCH";

export const EMDef = new ModDefine(MOD_PREFIX);

/**法术最大伤害 */
export const SPELL_MAX_DAMAGE = 1000000;
/**最大触发效果层数 */
export const TEFF_MAX = 1000000;

/**用于必定成功的控制法术的flags */
export const CON_SPELL_FLAG = ["SILENT", "NO_HANDS", "NO_LEGS", "NO_FAIL","NO_EXPLOSION_SFX"] as const;
