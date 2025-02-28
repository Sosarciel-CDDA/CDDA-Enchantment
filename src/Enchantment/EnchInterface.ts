import { BoolObj, Effect, EffectID, EocEffect, Flag, FlagID, ItemSearchData } from "cdda-schema";

/**可用的附魔类型 列表 */
export const VaildEnchTypeList = [
    "weapons"   ,
    "armor"     ,
    //"food"      ,
] as const;
/**可用的附魔类型 */
export type VaildEnchType = typeof VaildEnchTypeList[number];
/**附魔类型映射 */
export const EnchTypeSearchDataMap:Record<VaildEnchType,ItemSearchData[]> = {
    weapons :[{category:"weapons"}] ,
    armor   :[{category:"armor"}]   ,
    //food    :[{flags:["EATEN_HOT"]},{flags:["SMOKABLE"]}],
}

/**附魔强度效果的生效时机 列表 */
export const EffectActiveCondList = [
    "wield",
    "worn",
] as const;
/**附魔强度效果的生效时机 */
export type EffectActiveCond = typeof EffectActiveCondList[number];
/**生效时机映射 */
export const EffectActiveCondSearchDataMap:Record<EffectActiveCond,ItemSearchData[]> = {
    wield :[{wielded_only:true}] ,
    worn   :[{worn_only:true}]   ,
    //food    :[{flags:["EATEN_HOT"]},{flags:["SMOKABLE"]}],
}

/**附魔数据 */
export type EnchData = {
    /**id */
    id:string;
    /**主要标志 */
    main:Flag;
    /**冲突标识 */
    conflicts?:Flag[];
    /**附魔强度导致的效果 */
    intensity_effect?:EffectID[];
    /**强度生效方式 undefined时为全部 */
    effect_active_cond?:EffectActiveCond[];
    /**限制类型 */
    ench_type:VaildEnchType[];
    /**强度变体数据集 */
    lvl:EnchLvlData[];
    /**添加时会执行的effect */
    add_effects?:EocEffect[];
    /**移除时会执行的effect */
    remove_effects?:EocEffect[];
    /**是一个可以被移除诅移除的诅咒  
     * 默认false  
     */
    is_curse?:boolean;
}
/**附魔的其中一个等级变体的数据 */
export type EnchLvlData = {
    /**附魔标志 */
    ench:Flag;
    /**随机权重 */
    weight?:number;
    /**添加时会执行的effect */
    add_effects?:EocEffect[];
    /**移除时会执行的effect */
    remove_effects?:EocEffect[];
    /**附魔缓存强度  
     * 未定义则不计入缓存
     */
    intensity?:number;
    /**附魔点数  
     * 未定义则为0  
     */
    point?:number;
}