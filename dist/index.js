"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdda_event_1 = require("cdda-event");
const utils_1 = require("@zwa73/utils");
const path = require("path");
const DamageType_1 = require("./DamageType");
const Enchantment_1 = require("./Enchantment");
const dataPath = path.join(process.cwd(), 'data');
const envPath = path.join(process.cwd(), '..');
const gamePath = utils_1.UtilFT.loadJSONFileSync(path.join(envPath, 'build_setting.json')).game_path;
const outPath = path.join(gamePath, 'data', 'mods', 'CnpcEnchantment');
async function main() {
    const EnchDm = new cdda_event_1.DataManager(dataPath, outPath, "CENCHEF");
    await (0, Enchantment_1.createEnchantment)(EnchDm);
    await (0, DamageType_1.createDamageType)(EnchDm);
    await EnchDm.saveAllData();
}
main();
