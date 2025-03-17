export default function registerSystemSettings() {
  // World settings
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
    config: true,
    requiresReload: true,
    type: Boolean,
    default: false,
  });
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
  game.settings.register("smt-tc", "enablePierce", {
    name: "SMT.settings.enablePierce.name",
    hint: "SMT.settings.enablePierce.hint",
    scope: "world",
    config: true,
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
