import { Flag } from "cdda-schema";

/**可用的附魔类型 列表 */
export const VaildEnchCategoryList = [
    "weapons",
    "armor"
] as const;
/**可用的附魔类型 */
export type VaildEnchCategory = typeof VaildEnchCategoryList[number];

/**附魔集 */
export type EnchData = {
    /**id */
    id:string;
    /**主要标志 */
    main:Flag;
    /**冲突标识 */
    conflicts?:Flag[];
    /**限制类型 */
    category:VaildEnchCategory[];
    /**强度变体数据集 */
    lvl:{
        /**附魔标志 */
        ench:Flag;
        /**随机权重 */
        weight:number;
        /**附魔缓存强度  
         * 未定义则不计入缓存
         */
        intensity?:number;
    }[];
}