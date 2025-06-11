import { SMT } from "./config.js";

export default function registerSystemSettings() {
  // World settings
  game.settings.register("smt-tc", "autoCurseRolls", {
    name: "SMT.settings.autoCurseRolls.name",
    hint: "SMT.settings.autoCurseRolls.hint",
    scope: "world",
    config: true,
    requiresReload: true,
    type: Boolean,
    default: true,
  });

  // House/variant rules
  game.settings.register("smt-tc", "addLevelToGunDamage", {
    name: "SMT.settings.addLevelToGunDamage.name",
    hint: "SMT.settings.addLevelToGunDamage.hint",
    scope: "world",
    config: true,
    requiresReload: true,
    type: Boolean,
    default: false,
  });

  game.settings.register("smt-tc", "alternatePhysResistCalc", {
    name: "SMT.settings.alternatePhysResistCalc.name",
    hint: "SMT.settings.alternatePhysResistCalc.hint",
    scope: "world",
    config: true,
    requiresReload: true,
    type: String,
    choices: {
      ...SMT.alternateResistLevels.phys,
    },
    default: "raw",
  });

  game.settings.register("smt-tc", "alternateMagResistCalc", {
    name: "SMT.settings.alternateMagResistCalc.name",
    hint: "SMT.settings.alternateMagResistCalc.hint",
    scope: "world",
    config: true,
    requiresReload: true,
    type: String,
    choices: {
      ...SMT.alternateResistLevels.mag,
    },
    default: "raw",
  });

  game.settings.register("smt-tc", "editableGems", {
    name: "SMT.settings.editableGems.name",
    hint: "SMT.settings.editableGems.hint",
    scope: "world",
    config: true,
    requiresReload: true,
    type: Boolean,
    default: false,
  });
  game.settings.register("smt-tc", "editableActorSheetBuffs", {
    name: "SMT.settings.editableActorSheetBuffs.name",
    hint: "SMT.settings.editableActorSheetBuffs.hint",
    scope: "world",
    config: false,
    requiresReload: true,
    type: Boolean,
    default: false,
  });

  // Client settings
  game.settings.register("smt-tc", "showRollDialogByDefault", {
    name: "SMT.settings.showRollDialogByDefault.name",
    hint: "SMT.settings.showRollDialogByDefault.hint",
    scope: "client",
    config: true,
    requiresReload: false,
    type: Boolean,
    default: false,
  });
}
