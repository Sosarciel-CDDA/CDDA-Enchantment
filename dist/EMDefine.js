"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CON_SPELL_FLAG = exports.MAX_NUM = exports.EMDef = exports.MOD_PREFIX = void 0;
const cdda_schema_1 = require("cdda-schema");
/**mod物品前缀 */
exports.MOD_PREFIX = "CENCH";
exports.EMDef = new cdda_schema_1.ModDefine(exports.MOD_PREFIX);
/**默认的最大数值 */
exports.MAX_NUM = 1000000;
/**用于必定成功的控制法术的flags */
exports.CON_SPELL_FLAG = ["SILENT", "NO_HANDS", "NO_LEGS", "NO_FAIL", "NO_EXPLOSION_SFX"];
