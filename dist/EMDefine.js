"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CON_SPELL_FLAG = exports.TEFF_MAX = exports.SPELL_MAX_DAMAGE = exports.EMDef = exports.MOD_PREFIX = void 0;
const cdda_schema_1 = require("cdda-schema");
/**mod物品前缀 */
exports.MOD_PREFIX = "CENCH";
exports.EMDef = new cdda_schema_1.ModDefine(exports.MOD_PREFIX);
/**法术最大伤害 */
exports.SPELL_MAX_DAMAGE = 1000000;
/**最大触发效果层数 */
exports.TEFF_MAX = 1000000;
/**用于必定成功的控制法术的flags */
exports.CON_SPELL_FLAG = ["SILENT", "NO_HANDS", "NO_LEGS", "NO_FAIL", "NO_EXPLOSION_SFX"];
