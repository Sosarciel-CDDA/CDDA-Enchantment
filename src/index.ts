import { DataManager } from "cdda-event";
import { UtilFT } from '@zwa73/utils'
import * as path from 'path';
import { createDamageType } from "./DamageType";
import { createEnchantment } from "./Enchantment";




const dataPath = path.join(process.cwd(),'data');
const envPath = path.join(process.cwd(),'..');
const gamePath = UtilFT.loadJSONFileSync(path.join(envPath,'build_setting.json')).game_path as string;
const outPath = path.join(gamePath,'data','mods','CnpcEnchantment');

async function main(){
    const EnchDm = new DataManager(dataPath,outPath,"CENCHEF");
    await createEnchantment(EnchDm);
    await createDamageType(EnchDm);
    await EnchDm.saveAllData();
}
main();
