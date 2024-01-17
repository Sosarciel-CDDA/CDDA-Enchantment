"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdda_event_1 = require("cdda-event");
const utils_1 = require("@zwa73/utils");
const path = require("path");
const EnchItem_1 = require("./EnchItem");
const dataPath = path.join(process.cwd(), 'data');
const gamePath = utils_1.UtilFT.loadJSONFileSync(path.join(dataPath, 'build_setting.json')).game_path;
const outPath = path.join(gamePath, 'data', 'mods', 'Enchantment');
async function main() {
    const EnchDm = new cdda_event_1.DataManager(dataPath, outPath, "CENCHEF");
    await (0, EnchItem_1.createEnchItem)(EnchDm);
    await EnchDm.saveAllData();
}
main();
