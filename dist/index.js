"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const cdda_event_1 = require("cdda-event");
const utils_1 = require("@zwa73/utils");
const path = __importStar(require("path"));
const DamageType_1 = require("./DamageType");
const Enchantment_1 = require("./Enchantment");
const dataPath = path.join(process.cwd(), 'data');
const envPath = path.join(process.cwd(), '..');
const gamePath = utils_1.UtilFT.loadJSONFileSync(path.join(envPath, 'build_setting.json')).game_path;
const outPath = path.join(gamePath, 'data', 'mods', 'CustomEnch');
async function main() {
    const EnchDm = new cdda_event_1.DataManager(dataPath, outPath, "CENCHEF", { enableMoveStatus: false });
    await (0, Enchantment_1.createEnchantment)(EnchDm);
    await (0, DamageType_1.createDamageType)(EnchDm);
    await EnchDm.saveAllData();
}
main();
