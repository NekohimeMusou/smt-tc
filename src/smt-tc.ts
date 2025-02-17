import { SMT } from "./config/config.js";
import registerSystemSettings from "./config/settings.js";

declare global {
  interface CONFIG {
    SMT: typeof SMT;
  }
}

Hooks.once("init", async () => {
  console.log("SMT | Initializing SMT:TC game system");

  // Set up global configuration
  CONFIG.ActiveEffect.legacyTransferral = false;
  CONFIG.SMT = SMT;

  registerSystemSettings();

  await preloadHandlebarsTemplates();
});

async function preloadHandlebarsTemplates() {
  await loadTemplates(SMT.templatePaths);
}
