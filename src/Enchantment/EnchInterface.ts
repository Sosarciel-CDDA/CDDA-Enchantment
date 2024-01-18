import { Flag } from "cdda-schema";



/**附魔集 */
export type EnchSet = {
    /**主要标志 */
    main:Flag;
    /**强度变体数据集 */
    lvl:{
        /**附魔标志 */
        ench:Flag;
        /**随机权重 */
        weight:number;
    }[];
}