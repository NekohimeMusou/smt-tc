export default function registerSystemSettings() {
  game.settings.register("smt-tc", "editableGems", {
    name: "SMT.settings.editableGems.name",
    hint: "SMT.settings.editableGems.hint",
    scope: "world",
    config: true,
    requiresReload: true,
    type: Boolean,
    default: false,
  });
  game.settings.register("smt-tc", "addLevelToGunDamage", {
    name: "SMT.settings.addLevelToGunDamage.name",
    hint: "SMT.settings.addLevelToGunDamage.hint",
    scope: "world",
    config: true,
    requiresReload: true,
    type: Boolean,
    default: false,
  });
  game.settings.register("smt-tc", "invertHitModDialog", {
    name: "SMT.settings.invertHitModDialog.name",
    hint: "SMT.settings.invertHitModDialog.hint",
    scope: "client",
    config: true,
    requiresReload: false,
    type: Boolean,
    default: false,
  });
  game.settings.register("smt-tc", "invertPotencyDialog", {
    name: "SMT.settings.invertPotencyDialog.name",
    hint: "SMT.settings.invertPotencyDialog.hint",
    scope: "client",
    config: true,
    requiresReload: false,
    type: Boolean,
    default: false,
  });
  game.settings.register("smt-tc", "enableActorSheetBuffs", {
    name: "SMT.settings.enableActorSheetBuffs.name",
    hint: "SMT.settings.enableActorSheetBuffs.hint",
    scope: "client",
    config: true,
    requiresReload: true,
    type: Boolean,
    default: false,
  });
}
