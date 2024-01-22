"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareProc = exports.REMOVE_CURSE_EOC_ID = exports.INIT_ENCH_DATA_EOC_ID = exports.UPGRADE_ENCH_CACHE_EOC_ID = exports.IDENTIFY_EOC_ID = exports.enchLvlID = exports.enchInsVar = exports.enchEID = exports.IS_IDENTIFYED_FLAG_ID = exports.IS_CURSED_FLAG_ID = exports.N_ENCH_POINT_MAX = exports.ITEM_ENCH_TYPE = exports.N_ENCH_POINT = exports.N_COMPLETE_ENCH_INIT = exports.N_COMPLETE_IDENTIFY = exports.ENCH_ONE_IN = exports.MAX_ENCH_COUNT = exports.MAX_ENCH_POINT = void 0;
const EnchInterface_1 = require("./EnchInterface");
const EMDefine_1 = require("../EMDefine");
/**默认的最大附魔点数 */
exports.MAX_ENCH_POINT = 100;
/**最大附魔尝试次数 */
exports.MAX_ENCH_COUNT = 10;
/**附魔物品生成 one_in 概率 */
exports.ENCH_ONE_IN = 2;
/**表示物品完成鉴定的变量 */
exports.N_COMPLETE_IDENTIFY = "n_completedIdentify";
/**表示物品完成附魔初始化 */
exports.N_COMPLETE_ENCH_INIT = "n_completedEnchInit";
/**表示物品附魔点数的变量 */
exports.N_ENCH_POINT = "n_enchPoint";
/**表示物品的附魔类型 需初始化 */
exports.ITEM_ENCH_TYPE = "itemEnchType";
/**表述物品的最大附魔点数 */
exports.N_ENCH_POINT_MAX = "n_enchPointMax";
/**表示物品是被诅咒的  在鉴定后生效*/
exports.IS_CURSED_FLAG_ID = EMDefine_1.EMDef.genFlagID("IS_CURSED");
/**表示物品是被鉴定过的  在鉴定后生效*/
exports.IS_IDENTIFYED_FLAG_ID = EMDefine_1.EMDef.genFlagID("IS_IDENTIFYED");
/**通用eoc的id */
function enchEID(flag, t) {
    const id = typeof flag == "string" ? flag : flag.id;
    return EMDefine_1.EMDef.genEOCID(`${id}_${t}`);
}
exports.enchEID = enchEID;
/**附魔强度id */
function enchInsVar(ench, t) {
    return `${t}_${ench.id}`;
}
exports.enchInsVar = enchInsVar;
/**附魔的等级flagID */
function enchLvlID(baseID, lvl) {
    return EMDefine_1.EMDef.genFlagID(`${baseID}_${lvl}_Ench`);
}
exports.enchLvlID = enchLvlID;
/**随机鉴定EocID
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
    const out = [];
    //展开附魔集等级标志
    const enchFlagList = [];
    enchDataList.forEach((enchset) => enchset.lvl.forEach((lvlobj) => enchFlagList.push(lvlobj.ench)));
    //辅助eoc
    //添加附魔子eoc
    enchDataList.forEach((data) => {
        data.lvl.forEach((lvlobj) => {
            out.push(EMDefine_1.EMDef.genActEoc(enchEID(lvlobj.ench, "add"), [
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
            out.push(EMDefine_1.EMDef.genActEoc(enchEID(lvlobj.ench, "remove"), [
                { npc_unset_flag: lvlobj.ench.id },
                { npc_unset_flag: data.main.id },
                ...data.remove_effects ?? [],
                ...lvlobj.remove_effects ?? [],
            ], { npc_has_flag: lvlobj.ench.id }, true));
        });
    });
    //鉴定附魔Eoc
    const weightSum = enchDataList.reduce((enchsum, ench) => enchsum + ench.lvl.reduce((lvlobjsum, lvlobj) => (lvlobj.weight ?? 0) + lvlobjsum, 0), 0); //总附魔权重
    const noneWeight = weightSum / 10; //空附魔权重
    const weightListMap = {};
    EnchInterface_1.VaildEnchTypeList.forEach((et) => weightListMap[et] = []);
    const identifyCond = { and: [
            { math: [exports.N_COMPLETE_IDENTIFY, "!=", "1"] },
            { math: [exports.N_COMPLETE_ENCH_INIT, "==", '1'] },
            { or: EnchInterface_1.VaildEnchTypeList.map((cate) => ({ npc_has_var: exports.ITEM_ENCH_TYPE, value: cate })) },
        ] };
    const subeocid = EMDefine_1.EMDef.genEOCID('IdentifyEnch_each');
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
            ] },
        { u_message: "一件装备的详细属性被揭示了", type: "good" },
        { math: [exports.N_COMPLETE_IDENTIFY, "=", "1"] },
        { npc_set_flag: exports.IS_IDENTIFYED_FLAG_ID },
    ], identifyCond, true);
    const noneEnchEoc = EMDefine_1.EMDef.genActEoc("NoneEnch", []);
    for (const enchCate of EnchInterface_1.VaildEnchTypeList) {
        enchDataList.forEach((ench) => {
            const wlist = weightListMap[enchCate];
            if (ench.ench_type.includes(enchCate)) {
                ench.lvl.forEach((lvlobj) => wlist.push([enchEID(lvlobj.ench, "add"), { math: [`${(lvlobj.weight ?? 0)}`] }]));
                wlist.push([noneEnchEoc.id, { math: [`${noneWeight}`] }]);
            }
        });
    }
    out.push(identifyEnchEoc, noneEnchEoc);
    //累计附魔缓存
    const sumCacheEffects = [];
    enchDataList.forEach((ench) => {
        ench.lvl.forEach((lvlobj) => {
            if (lvlobj.intensity != null) {
                sumCacheEffects.push({
                    if: { npc_has_flag: lvlobj.ench.id },
                    then: [{ math: [enchInsVar(ench, "u"), "+=", `${lvlobj.intensity}`] }]
                });
            }
        });
    });
    const sumCacheEoc = EMDefine_1.EMDef.genActEoc("SumEnchCache", [
        //{u_message:"sumCacheEffects"},
        ...sumCacheEffects
    ]);
    out.push(sumCacheEoc);
    //清理附魔缓存
    const clearCacheEoc = EMDefine_1.EMDef.genActEoc("ClearEnchCache", enchDataList.map((ench) => ({ math: [enchInsVar(ench, "u"), "=", "0"] })));
    out.push(clearCacheEoc);
    //刷新附魔缓存eoc
    const upgradeEnchCache = EMDefine_1.EMDef.genActEoc(exports.UPGRADE_ENCH_CACHE_EOC_ID, [
        { run_eocs: clearCacheEoc.id },
        { u_run_inv_eocs: "all",
            search_data: [{ wielded_only: true }, { worn_only: true }],
            true_eocs: sumCacheEoc.id },
    ], undefined, true);
    dm.addInvokeEoc("WearItem", 1, upgradeEnchCache);
    dm.addInvokeEoc("WieldItemRaw", 1, upgradeEnchCache);
    dm.addInvokeEoc("SlowUpdate", 1, upgradeEnchCache);
    out.push(upgradeEnchCache);
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
    //根据缓存添加效果
    enchDataList.forEach((ench) => {
        if (ench.effect != null) {
            const eids = ench.effect;
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
    //鉴定穿戴的物品
    const identifyWear = EMDefine_1.EMDef.genActEoc("IdentifyEnch_Wear", [
        { run_eocs: [exports.INIT_ENCH_DATA_EOC_ID, exports.IDENTIFY_EOC_ID] },
    ], { math: [exports.N_COMPLETE_IDENTIFY, "!=", "1"] });
    dm.addInvokeEoc("WearItem", 2, identifyWear);
    dm.addInvokeEoc("WieldItem", 2, identifyWear);
    dm.addInvokeEoc("EatItem", 2, identifyWear);
    out.push(identifyWear);
    //移除指定诅咒
    const removeCurseEffects = [{ npc_unset_flag: exports.IS_CURSED_FLAG_ID }];
    enchDataList.forEach((ench) => {
        if (ench.is_curse == true)
            removeCurseEffects.push(...ench.lvl.map((lvlobj) => ({ run_eocs: enchEID(lvlobj.ench, "remove") })));
    });
    const removeCurse = EMDefine_1.EMDef.genActEoc(exports.REMOVE_CURSE_EOC_ID, [
        ...removeCurseEffects
    ], undefined, true);
    out.push(removeCurse);
    //表示物品是被诅咒的flag
    const cursedFlag = {
        type: "json_flag",
        id: exports.IS_CURSED_FLAG_ID,
        name: "诅咒的",
        info: `<bad>[诅咒的]</bad> 这件含有诅咒`
    };
    out.push(cursedFlag);
    const identedFlag = {
        type: "json_flag",
        id: exports.IS_IDENTIFYED_FLAG_ID,
        name: "完成鉴定",
        info: `<good>[完成鉴定]</good> 你已经了解了这件物品的详情`
    };
    out.push(identedFlag);
    dm.addStaticData(out, "Common");
    return enchFlagList;
}
exports.prepareProc = prepareProc;
