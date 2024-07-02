"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REMOVE_CURSE_EOC_ID = exports.INIT_ENCH_DATA_EOC_ID = exports.UPGRADE_ENCH_CACHE_EOC_ID = exports.IDENTIFY_EOC_ID = exports.IS_ENCHED_FLAG_ID = exports.IS_IDENTIFYED_FLAG_ID = exports.IS_CURSED_FLAG_ID = exports.ITEM_ENCH_TYPE = exports.N_ENCH_POINT_MAX = exports.N_ENCH_POINT = exports.N_COMPLETE_ENCH_INIT = exports.ENCH_ONE_IN = exports.MAX_ENCH_COUNT = exports.MAX_ENCH_POINT = void 0;
exports.auxEID = auxEID;
exports.enchInsVar = enchInsVar;
exports.enchLvlID = enchLvlID;
exports.prepareProc = prepareProc;
exports.flatEnchFlag = flatEnchFlag;
const EnchInterface_1 = require("./EnchInterface");
const EMDefine_1 = require("../EMDefine");
/**默认的最大附魔点数 */
exports.MAX_ENCH_POINT = 100;
/**最大附魔尝试次数 */
exports.MAX_ENCH_COUNT = 10;
/**附魔物品生成 one_in 概率 */
exports.ENCH_ONE_IN = 2;
/**表示物品完成附魔初始化 */
exports.N_COMPLETE_ENCH_INIT = "n_completedEnchInit";
/**表示物品附魔点数的变量 */
exports.N_ENCH_POINT = "n_enchPoint";
/**表述物品的最大附魔点数 需初始化 */
exports.N_ENCH_POINT_MAX = "n_enchPointMax";
/**表示物品的附魔类型 需初始化 */
exports.ITEM_ENCH_TYPE = "itemEnchType";
/**表示物品是被诅咒的 需鉴定 */
exports.IS_CURSED_FLAG_ID = EMDefine_1.EMDef.genFlagID("IS_CURSED");
/**表示物品是被鉴定过的 需鉴定 */
exports.IS_IDENTIFYED_FLAG_ID = EMDefine_1.EMDef.genFlagID("IS_IDENTIFYED");
/**表示物品是含有附魔 需鉴定 */
exports.IS_ENCHED_FLAG_ID = EMDefine_1.EMDef.genFlagID("IS_ENCHED");
/**辅助eoc的id 对 beta 增减某个附魔 */
function auxEID(flag, t) {
    const id = typeof flag == "string" ? flag : flag.id;
    return EMDefine_1.EMDef.genEOCID(`${id}_${t}`);
}
/**附魔强度id */
function enchInsVar(ench, t) {
    return `${t}_${ench.id}`;
}
/**附魔的等级flagID */
function enchLvlID(baseID, lvl) {
    return EMDefine_1.EMDef.genFlagID(`${baseID}_${lvl}_Ench`);
}
/**鉴定EocID
 * 对 beta 进行鉴定
 * 随机添加附魔
 * u为角色 n为物品
 */
exports.IDENTIFY_EOC_ID = EMDefine_1.EMDef.genEOCID("IdentifyEnch");
/**刷新附魔缓存EocID
 * u为角色 n不存在
 */
exports.UPGRADE_ENCH_CACHE_EOC_ID = EMDefine_1.EMDef.genEOCID("UpgradeEnchCache");
/**初始化附魔数据
 * 在尝试添加附魔前需运行
 * u为角色 n不存在
 */
exports.INIT_ENCH_DATA_EOC_ID = EMDefine_1.EMDef.genEOCID("InitEnchData");
/**移除诅咒EocID */
exports.REMOVE_CURSE_EOC_ID = EMDefine_1.EMDef.genEOCID("RemoveCurse");
async function prepareProc(dm, enchDataList) {
    const out = [
        ...auxEoc(enchDataList), //辅助eoc
        ...identifyEoc(enchDataList), //鉴定附魔Eoc
        ...removeCurseEoc(enchDataList), //移除诅咒
        ...initEnchDataEoc(enchDataList), //初始化附魔数据
    ];
    //清理附魔缓存
    const clearCacheEoc = EMDefine_1.EMDef.genActEoc("ClearEnchCache", enchDataList.map((ench) => ({ math: [enchInsVar(ench, "u"), "=", "0"] })));
    out.push(clearCacheEoc);
    //刷新附魔缓存eoc
    const upgradeEnchCache = EMDefine_1.EMDef.genActEoc(exports.UPGRADE_ENCH_CACHE_EOC_ID, [
        { run_eocs: clearCacheEoc.id },
        //遍历生效条件
        ...EnchInterface_1.EffectActiveCondList.map((cond) => {
            const eff = {
                u_run_inv_eocs: "all",
                search_data: EnchInterface_1.EffectActiveCondSearchDataMap[cond],
                true_eocs: {
                    eoc_type: "ACTIVATION",
                    id: EMDefine_1.EMDef.genEOCID(`SumEnchCache_${cond}`),
                    effect: [
                        //遍历附魔
                        ...enchDataList.map((ench) => ench.lvl.map((lvlobj) => {
                            const activeCond = ench.effect_active_cond ?? [...EnchInterface_1.EffectActiveCondList];
                            if (lvlobj.intensity != null && activeCond.includes(cond)) {
                                const seff = {
                                    if: { npc_has_flag: lvlobj.ench.id },
                                    then: [{ math: [enchInsVar(ench, "u"), "+=", `${lvlobj.intensity}`] }]
                                };
                                return seff;
                            }
                            return undefined;
                        }).filter((e) => e !== undefined)).flat()
                    ]
                }
            };
            return eff;
        })
    ], undefined, true);
    dm.addInvokeEoc("WearItem", 1, upgradeEnchCache);
    dm.addInvokeEoc("WieldItemRaw", 1, upgradeEnchCache);
    dm.addInvokeEoc("SlowUpdate", 1, upgradeEnchCache);
    out.push(upgradeEnchCache);
    //根据缓存添加效果
    enchDataList.forEach((ench) => {
        if (ench.intensity_effect != null) {
            const eids = ench.intensity_effect;
            //触发eoc
            const teoc = EMDefine_1.EMDef.genActEoc(`${ench.id}_AddEffect`, [
                { if: { math: [enchInsVar(ench, "u"), ">=", "1"] },
                    then: [
                        //{u_message:ench.id},
                        ...eids.map((eid) => {
                            const eff = { u_add_effect: eid, intensity: { math: [enchInsVar(ench, "u")] }, duration: "PERMANENT" };
                            return eff;
                        })
                    ],
                    else: [...eids.map((eid) => {
                            const eff = { u_lose_effect: eid };
                            return eff;
                        })] }
            ]);
            dm.addInvokeEoc("WearItem", 0, teoc);
            dm.addInvokeEoc("WieldItemRaw", 0, teoc);
            dm.addInvokeEoc("SlowUpdate", 0, teoc);
            out.push(teoc);
        }
    });
    //鉴定使用的物品 物品为 beta
    const identifyWear = EMDefine_1.EMDef.genActEoc("IdentifyEnch_Use", [
        { run_eocs: [exports.INIT_ENCH_DATA_EOC_ID, exports.IDENTIFY_EOC_ID] },
    ], { not: { npc_has_flag: exports.IS_IDENTIFYED_FLAG_ID } });
    dm.addInvokeEoc("WearItem", 2, identifyWear);
    dm.addInvokeEoc("WieldItem", 2, identifyWear);
    //dm.addInvokeEoc("EatItem"  ,2,identifyWear);
    out.push(identifyWear);
    //共用flag
    //表示物品是被诅咒的flag
    const cursedFlag = {
        type: "json_flag",
        id: exports.IS_CURSED_FLAG_ID,
        name: "诅咒的",
        info: `<bad>[诅咒的]</bad> 这件物品含有诅咒`
    };
    //表示物品已鉴定过的flag
    const identedFlag = {
        type: "json_flag",
        id: exports.IS_IDENTIFYED_FLAG_ID,
        name: "完成鉴定",
        info: `<good>[完成鉴定]</good> 你已经了解了这件物品的详情`
    };
    //表示物品含有附魔属性的flag
    const enchedFlag = {
        type: "json_flag",
        id: exports.IS_ENCHED_FLAG_ID,
        name: "魔法物品",
        info: `<good>[魔法物品]</good> 这件物品被附魔了`
    };
    out.push(cursedFlag, identedFlag, enchedFlag);
    dm.addData(out, "Common");
}
/**生成辅助eoc */
function auxEoc(enchDataList) {
    const out = [];
    //辅助eoc
    //添加附魔子eoc
    enchDataList.forEach((data) => {
        data.lvl.forEach((lvlobj) => {
            out.push(EMDefine_1.EMDef.genActEoc(auxEID(lvlobj.ench, "add"), [
                { npc_set_flag: lvlobj.ench.id },
                { npc_set_flag: data.main.id },
                ...(data.is_curse ? [{ npc_set_flag: exports.IS_CURSED_FLAG_ID }] : []),
                { math: [exports.N_ENCH_POINT, "+=", `${lvlobj.point}`] },
                ...data.add_effects ?? [],
                ...lvlobj.add_effects ?? [],
            ], { and: [
                    //排除冲突
                    { not: { or: [
                                ...(lvlobj.ench.conflicts ?? [])
                                    .map((id) => ({ npc_has_flag: id })),
                                { npc_has_flag: lvlobj.ench.id },
                            ] } },
                    //符合类型
                    { or: [
                            ...(data.ench_type.map((t) => ({
                                npc_has_var: exports.ITEM_ENCH_TYPE,
                                value: t,
                            })))
                        ] },
                    //排除自体护甲与生化武器
                    { not: { or: [
                                { npc_has_flag: "BIONIC_WEAPON" }, //生化武器
                                { npc_has_flag: "INTEGRATED" }, //自体护甲
                            ] } }
                ] }, true));
        });
    });
    //{not:{npc_has_flag:enchset.main.id}}
    //移除附魔子eoc
    enchDataList.forEach((data) => {
        data.lvl.forEach((lvlobj) => {
            out.push(EMDefine_1.EMDef.genActEoc(auxEID(lvlobj.ench, "remove"), [
                { npc_unset_flag: lvlobj.ench.id },
                { npc_unset_flag: data.main.id },
                ...data.remove_effects ?? [],
                ...lvlobj.remove_effects ?? [],
            ], { npc_has_flag: lvlobj.ench.id }, true));
        });
    });
    return out;
}
/**生成鉴定eoc */
function identifyEoc(enchDataList) {
    const out = [];
    //总附魔权重
    const weightSum = enchDataList.reduce((enchsum, ench) => enchsum + ench.lvl.reduce((lvlobjsum, lvlobj) => (lvlobj.weight ?? 0) + lvlobjsum, 0), 0);
    //空附魔权重
    const noneWeight = weightSum / 10;
    //空附魔
    const noneEnchEoc = EMDefine_1.EMDef.genActEoc("NoneEnch", []);
    //根据随机权重生成 附魔类别 : weight_list_eoc数据 表单
    const weightListMap = {};
    //初始化表单数组
    EnchInterface_1.VaildEnchTypeList.forEach((et) => weightListMap[et] = []);
    //遍历附魔类别与附魔数据表
    for (const enchCate of EnchInterface_1.VaildEnchTypeList) {
        enchDataList.forEach((ench) => {
            const wlist = weightListMap[enchCate];
            if (ench.ench_type.includes(enchCate)) {
                //将辅助eoc加入表单
                ench.lvl.forEach((lvlobj) => wlist.push([auxEID(lvlobj.ench, "add"), { math: [`${(lvlobj.weight ?? 0)}`] }]));
                //将空eoc加入表单
                wlist.push([noneEnchEoc.id, { math: [`${noneWeight}`] }]);
            }
        });
    }
    //鉴定条件
    const identifyCond = { and: [
            { not: { npc_has_flag: exports.IS_IDENTIFYED_FLAG_ID } },
            { math: [exports.N_COMPLETE_ENCH_INIT, "==", '1'] },
            { or: EnchInterface_1.VaildEnchTypeList.map((cate) => ({ npc_has_var: exports.ITEM_ENCH_TYPE, value: cate })) },
        ] };
    const subeocid = EMDefine_1.EMDef.genEOCID('IdentifyEnch_each');
    //鉴定主EOC
    const identifyEnchEoc = EMDefine_1.EMDef.genActEoc(exports.IDENTIFY_EOC_ID, [
        { if: { one_in_chance: exports.ENCH_ONE_IN },
            then: [
                { math: ["_eachCount", "=", `${exports.MAX_ENCH_COUNT}`] },
                ...(EnchInterface_1.VaildEnchTypeList.map((cate) => {
                    const eff = { run_eocs: {
                            id: `${subeocid}_${cate}`,
                            eoc_type: "ACTIVATION",
                            effect: [
                                { weighted_list_eocs: weightListMap[cate] },
                                { math: ["_eachCount", "-=", "1"] },
                                { run_eocs: `${subeocid}_${cate}` }
                            ],
                            condition: { and: [
                                    { math: ["_eachCount", ">", `0`] },
                                    { math: [exports.N_ENCH_POINT, "<", exports.N_ENCH_POINT_MAX] }
                                ] }
                        } };
                    return eff;
                })),
                { u_message: "你从一件装备上发现了附魔", type: "good" },
                { npc_set_flag: exports.IS_ENCHED_FLAG_ID },
            ] },
        { u_message: "一件装备的详细属性被揭示了", type: "good" },
        { npc_set_flag: exports.IS_IDENTIFYED_FLAG_ID },
    ], identifyCond, true);
    out.push(identifyEnchEoc, noneEnchEoc);
    return out;
}
/**生成移除诅咒eoc */
function removeCurseEoc(enchDataList) {
    const out = [];
    //移除指定诅咒
    const removeCurseEffects = [{ npc_unset_flag: exports.IS_CURSED_FLAG_ID }];
    enchDataList.forEach((ench) => {
        if (ench.is_curse == true)
            removeCurseEffects.push(...ench.lvl.map((lvlobj) => ({ run_eocs: auxEID(lvlobj.ench, "remove") })));
    });
    const removeCurse = EMDefine_1.EMDef.genActEoc(exports.REMOVE_CURSE_EOC_ID, [
        ...removeCurseEffects
    ], undefined, true);
    out.push(removeCurse);
    return out;
}
/**生成初始化附魔数据eoc */
function initEnchDataEoc(enchDataList) {
    const out = [];
    //初始化附魔数据
    const initeffects = (EnchInterface_1.VaildEnchTypeList.map((t) => ({
        u_run_inv_eocs: "all",
        search_data: [...EnchInterface_1.EnchTypeSearchDataMap[t]],
        true_eocs: {
            id: EMDefine_1.EMDef.genEOCID(`initEnchData_${t}`),
            eoc_type: "ACTIVATION",
            effect: [
                { npc_add_var: exports.ITEM_ENCH_TYPE, value: t },
                { math: [exports.N_ENCH_POINT_MAX, "=", `${exports.MAX_ENCH_POINT}`] },
                { math: [exports.N_COMPLETE_ENCH_INIT, "=", '1'] }
            ],
            condition: { math: [exports.N_COMPLETE_ENCH_INIT, "!=", '1'] }
        }
    })));
    const initEnchData = EMDefine_1.EMDef.genActEoc(exports.INIT_ENCH_DATA_EOC_ID, [
        ...initeffects
    ], undefined, true);
    out.push(initEnchData);
    return out;
}
/**展开附魔等级变体flag */
async function flatEnchFlag(enchDataList) {
    //展开附魔集等级标志
    const enchFlagList = [];
    enchDataList.forEach((enchset) => enchset.lvl.forEach((lvlobj) => enchFlagList.push(lvlobj.ench)));
    return enchFlagList;
}
