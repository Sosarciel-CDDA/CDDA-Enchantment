"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareProc = exports.INIT_ENCH_DATA_EOC_ID = exports.UPGRADE_ENCH_CACHE_EOC_ID = exports.IDENTIFY_EOC_ID = exports.enchInsVar = exports.enchEID = void 0;
const EnchInterface_1 = require("./EnchInterface");
const EMDefine_1 = require("../EMDefine");
/**通用eoc的id */
function enchEID(flag, t) {
    return EMDefine_1.EMDef.genEOCID(`${flag.id}_${t}`);
}
exports.enchEID = enchEID;
/**附魔强度id */
function enchInsVar(ench, t) {
    return `${t}_${ench.id}`;
}
exports.enchInsVar = enchInsVar;
/**随机鉴定EocID */
exports.IDENTIFY_EOC_ID = EMDefine_1.EMDef.genEOCID("IdentifyEnch");
/**刷新附魔缓存EocID */
exports.UPGRADE_ENCH_CACHE_EOC_ID = EMDefine_1.EMDef.genEOCID("UpgradeEnchCache");
/**初始化附魔数据
 * 在尝试添加附魔前需运行
 */
exports.INIT_ENCH_DATA_EOC_ID = EMDefine_1.EMDef.genEOCID("InitEnchData");
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
                { npc_set_flag: data.main.id }
            ], { and: [
                    //排除冲突
                    { not: { or: [
                                ...(lvlobj.ench.conflicts ?? [])
                                    .map((id) => ({ npc_has_flag: id })),
                                { npc_has_flag: lvlobj.ench.id },
                            ] } },
                    //符合类型
                    { or: [
                            ...(data.category.map((t) => ({
                                npc_has_var: "enchCategory",
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
                { npc_unset_flag: data.main.id }
            ], { npc_has_flag: lvlobj.ench.id }, true));
        });
    });
    //鉴定附魔Eoc
    const enchPointMax = 10; //最大点数
    const eachMax = 10; //最大尝试次数
    const enchChange = 2; //附魔one_in概率
    const weightSum = enchDataList.reduce((enchsum, ench) => enchsum + ench.lvl.reduce((lvlobjsum, lvlobj) => lvlobj.weight + lvlobjsum, 0), 0); //总附魔权重
    const noneWeight = weightSum / 10; //空附魔权重
    const weightListMap = {
        "armor": [],
        "weapons": []
    };
    const identifyCond = { and: [
            { math: ["n_isIdentifyEnch", "!=", "1"] },
            { or: EnchInterface_1.VaildEnchCategoryList.map((cate) => ({ npc_has_var: "enchCategory", value: cate })) }
        ] };
    const subeocid = EMDefine_1.EMDef.genEOCID('IdentifyEnch_each');
    const identifyEnchEoc = EMDefine_1.EMDef.genActEoc(exports.IDENTIFY_EOC_ID, [
        { if: { one_in_chance: enchChange },
            then: [
                { math: ["_eachCount", "=", `${eachMax}`] },
                ...(EnchInterface_1.VaildEnchCategoryList.map((cate) => {
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
                                    { math: ["n_enchPoint", "<", `${enchPointMax}`] }
                                ] }
                        } };
                    return eff;
                })),
                { u_message: "你从一件装备上发现了附魔" },
            ] },
        { u_message: "你了解了一件装备" },
        { math: ["n_isIdentifyEnch", "=", "1"] },
    ], identifyCond, true);
    const noneEnchEoc = EMDefine_1.EMDef.genActEoc("NoneEnch", []);
    for (const enchCate of EnchInterface_1.VaildEnchCategoryList) {
        enchDataList.forEach((ench) => {
            const wlist = weightListMap[enchCate];
            if (ench.category.includes(enchCate)) {
                ench.lvl.forEach((lvlobj) => wlist.push([enchEID(lvlobj.ench, "add"), { math: [`${lvlobj.weight}`] }]));
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
            search_data: [{ wielded_only: true }],
            true_eocs: sumCacheEoc.id },
        { u_run_inv_eocs: "all",
            search_data: [{ worn_only: true }],
            true_eocs: sumCacheEoc.id },
    ], undefined, true);
    dm.addInvokeEoc("WearItem", 1, upgradeEnchCache);
    dm.addInvokeEoc("WieldItemRaw", 1, upgradeEnchCache);
    dm.addInvokeEoc("SlowUpdate", 1, upgradeEnchCache);
    out.push(upgradeEnchCache);
    //初始化附魔数据
    const initeffects = (EnchInterface_1.VaildEnchCategoryList.map((t) => ({
        u_run_inv_eocs: "all",
        search_data: [{ category: t }],
        true_eocs: {
            id: EMDefine_1.EMDef.genEOCID(`initEnchData_${t}`),
            eoc_type: "ACTIVATION",
            effect: [
                { npc_add_var: "enchCategory", value: t }
            ]
        }
    })));
    const initEnchData = EMDefine_1.EMDef.genActEoc(exports.INIT_ENCH_DATA_EOC_ID, [
        ...initeffects
    ], undefined, true);
    out.push(initEnchData);
    //根据缓存添加效果
    enchDataList.forEach((ench) => {
        if (ench.effect != null) {
            const eff = ench.effect;
            //触发eoc
            const teoc = EMDefine_1.EMDef.genActEoc(`${ench.id}_AddEffect`, [
                { if: { math: [enchInsVar(ench, "u"), ">=", "1"] },
                    then: [
                        //{u_message:ench.id},
                        { u_add_effect: eff.id, intensity: { math: [enchInsVar(ench, "u")] }, duration: "PERMANENT" }
                    ],
                    else: [{ u_lose_effect: eff.id }] }
            ]);
            dm.addInvokeEoc("WearItem", 0, teoc);
            dm.addInvokeEoc("WieldItem", 0, teoc);
            out.push(teoc);
        }
    });
    //鉴定穿戴的物品
    const identifyWear = EMDefine_1.EMDef.genActEoc("IdentifyEnch_Wear", [
        { run_eocs: [exports.INIT_ENCH_DATA_EOC_ID, exports.IDENTIFY_EOC_ID] },
    ], { math: ["n_isIdentifyEnch", "!=", "1"] });
    dm.addInvokeEoc("WearItem", 2, identifyWear);
    dm.addInvokeEoc("WieldItem", 2, identifyWear);
    out.push(identifyWear);
    dm.addStaticData(out, "Common");
    return enchFlagList;
}
exports.prepareProc = prepareProc;
