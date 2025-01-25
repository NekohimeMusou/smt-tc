import { SMT } from "./config/config.js";
import { configureStatusEffects } from "./config/statuses.js";

declare global {
  interface CONFIG {
    SMT: typeof SMT;
  }
}

Hooks.once("init", async () => {
  console.log("SMT | Initializing SMT game system");

  // Set up global configuration
  CONFIG.ActiveEffect.legacyTransferral = false;
  CONFIG.SMT = SMT;
  // game.smt = {
  //   SmtActor,
  //   SmtItem,
  // };

  // registerDataModels();
  // registerDocumentClasses();
  // registerSheetApplications();
  registerSystemSettings();
  // registerHooks();
  configureStatusEffects();

  await preloadHandlebarsTemplates();
});

function registerSystemSettings() {
  game.settings.register("smt-tc", "invertShiftBehavior", {
    name: "SMT.settings.invertShiftBehavior.name",
    hint: "SMT.settings.invertShiftBehavior.hint",
    scope: "client",
    config: true,
    requiresReload: false,
    type: Boolean,
    default: false,
  });
}

async function preloadHandlebarsTemplates() {
  await loadTemplates(SMT.templatePaths);
}
