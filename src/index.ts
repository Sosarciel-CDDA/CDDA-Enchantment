import { DataManager } from "cdda-event";
import { UtilFT } from '@zwa73/utils'
import * as path from 'path';
import { createEnchItem } from "./EnchItem";




const dataPath = path.join(process.cwd(),'data');
const gamePath = UtilFT.loadJSONFileSync(path.join(dataPath,'build_setting.json')).game_path as string;
const outPath = path.join(gamePath,'data','mods','Enchantment');

async function main(){
    const EnchDm = new DataManager(dataPath,outPath,"CENCHEF");
    await createEnchItem(EnchDm);
    await EnchDm.saveAllData();
}
main();
