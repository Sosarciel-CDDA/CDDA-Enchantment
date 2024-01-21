import { EffectID, EocEffect, Flag } from "cdda-schema";
/**可用的附魔类型 列表 */
export declare const VaildEnchCategoryList: readonly ["weapons", "armor"];
/**可用的附魔类型 */
export type VaildEnchCategory = typeof VaildEnchCategoryList[number];
/**附魔数据 */
export type EnchData = {
    /**id */
    id: string;
    /**主要标志 */
    main: Flag;
    /**冲突标识 */
    conflicts?: Flag[];
    /**效果 */
    effect?: EffectID[];
    /**限制类型 */
    categorys: VaildEnchCategory[];
    /**强度变体数据集 */
    lvl: EnchLvlData[];
    /**添加时会执行的effect */
    add_effects?: EocEffect[];
    /**移除时会执行的effect */
    remove_effects?: EocEffect[];
    /**是一个可以被移除诅移除的诅咒
     * 默认false
     */
    is_curse?: boolean;
};
/**附魔的其中一个等级变体的数据 */
export type EnchLvlData = {
    /**附魔标志 */
    ench: Flag;
    /**随机权重 */
    weight?: number;
    /**添加时会执行的effect */
    add_effects?: EocEffect[];
    /**移除时会执行的effect */
    remove_effects?: EocEffect[];
    /**附魔缓存强度
     * 未定义则不计入缓存
     */
    intensity?: number;
    /**附魔点数
     * 未定义则为0
     */
    point?: number;
};
