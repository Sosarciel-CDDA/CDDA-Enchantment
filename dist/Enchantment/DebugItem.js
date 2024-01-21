"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debugItem = void 0;
const EMDefine_1 = require("../EMDefine");
const Common_1 = require("./Common");
async function debugItem(dm, enchFlagList) {
    const out = [];
    const NONEEocId = "EnchTestNone";
    const enchTestList = [
        [EMDefine_1.EMDef.genActEoc("EnchTestAdd", [{ run_eocs: Common_1.INIT_ENCH_DATA_EOC_ID }, {
                    run_eoc_selector: [...enchFlagList.map((ench) => (0, Common_1.enchEID)(ench, "add")), NONEEocId],
                    names: [...enchFlagList.map((ench) => ench.name), "算了"],
                    hide_failing: true
                }]), "添加附魔"],
        [EMDefine_1.EMDef.genActEoc("EnchTestRemove", [{
                    run_eoc_selector: [...enchFlagList.map((ench) => (0, Common_1.enchEID)(ench, "remove")), NONEEocId],
                    names: [...enchFlagList.map((ench) => ench.name), "算了"],
                    hide_failing: true
                }]), "移除附魔"],
        [EMDefine_1.EMDef.genActEoc(NONEEocId, [], undefined, true), "取消调试"],
    ];
    out.push(...enchTestList.map((item) => item[0]));
    const EnchTestTool = {
        id: EMDefine_1.EMDef.genGenericID("EnchTestTool"),
        type: "GENERIC",
        name: { str_sp: "附魔调试工具" },
        description: "附魔调试工具",
        weight: 0,
        volume: 0,
        symbol: "o",
        flags: ["ZERO_WEIGHT", "UNBREAKABLE"],
        use_action: {
            type: "effect_on_conditions",
            description: "附魔调试",
            menu_text: "附魔调试",
            effect_on_conditions: [{
                    eoc_type: "ACTIVATION",
                    id: EMDefine_1.EMDef.genEOCID("EnchTestTool"),
                    effect: [{
                            u_run_inv_eocs: "manual",
                            title: "选择需要调试的物品",
                            true_eocs: {
                                id: "EnchTestTool_SelectType",
                                eoc_type: "ACTIVATION",
                                effect: [{
                                        run_eoc_selector: enchTestList.map((item) => item[0].id),
                                        names: enchTestList.map((item) => item[1]),
                                        title: "选择选择调试类型"
                                    }]
                            }
                        }]
                }]
        }
    };
    out.push(EnchTestTool);
    dm.addStaticData(out, "EnchTest");
}
exports.debugItem = debugItem;
