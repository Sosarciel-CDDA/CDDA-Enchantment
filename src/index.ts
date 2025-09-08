import { DataManager } from "@sosarciel-cdda/event";
import * as path from 'path';
import { createDamageType } from "./DamageType";
import { createEnchantment } from "./Enchantment";
import { GAME_MOD_DIR } from "@sosarciel-cdda/schema";

const dataPath = path.join(process.cwd(),'data');
const outPath = path.join(GAME_MOD_DIR,'CustomEnch');

async function main(){
    const EnchDm = new DataManager(dataPath,outPath,"CENCHEF",{enableMoveStatus:false});
    await createEnchantment(EnchDm);
    await createDamageType(EnchDm);
    await EnchDm.saveAllData();
}
main();
