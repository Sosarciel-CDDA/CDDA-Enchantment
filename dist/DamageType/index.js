"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDamageType = void 0;
const Electrify_1 = require("./Electrify");
const Trauma_1 = require("./Trauma");
const Freeze_1 = require("./Freeze");
const Knockback_1 = require("./Knockback");
async function createDamageType(dm) {
    await (0, Electrify_1.Electrify)(dm);
    await (0, Electrify_1.Discharge)(dm);
    await (0, Trauma_1.Trauma)(dm);
    await (0, Trauma_1.Laceration)(dm);
    await (0, Freeze_1.Freeze)(dm);
    await (0, Knockback_1.Knockback)(dm);
}
exports.createDamageType = createDamageType;
