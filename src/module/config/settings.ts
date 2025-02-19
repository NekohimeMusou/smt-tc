export default function registerSystemSettings() {
  game.settings.register("smt-tc", "invertShiftBehavior", {
    name: "SMT.settings.invertShiftBehavior.name",
    hint: "SMT.settings.invertShiftBehavior.hint",
    scope: "client",
    config: true,
    requiresReload: false,
    type: Boolean,
    default: false,
  });
  // TODO: Add a button to chat output for manual dodging
  // TODO: Give option to only have GM controlled tokens/NPCs auto dodge
  // game.settings.register("smt-tc", "autoDodge", {
  //   name: "SMT.settings.autoDodge.name",
  //   hint: "SMT.settings.autoDodge.hint",
  //   scope: "world",
  //   config: true,
  //   requiresReload: false,
  //   type: Boolean,
  //   default: true,
  // // });
  game.settings.register("smt-tc", "addLevelToGunDamage", {
    name: "SMT.settings.addLevelToGunDamage.name",
    hint: "SMT.settings.addLevelToGunDamage.hint",
    scope: "world",
    config: true,
    requiresReload: true,
    type: Boolean,
    default: false,
  });
  // game.settings.register("smt-tc", "enablePierce", {
  //   name: "SMT.settings.enablePierce.name",
  //   hint: "SMT.settings.enablePierce.hint",
  //   scope: "world",
  //   config: true,
  //   requiresReload: false,
  //   type: Boolean,
  //   default: false,
  // });
  // TODO: Figure out what to do with ailment resistances
}
