import registerModuleAPIs from "./config/api.js";
import { SMT } from "./config/config.js";
import { createBasicStrike } from "./config/hooks.js";
import registerSystemSettings from "./config/settings.js";
import { configureStatusEffects } from "./config/statuses.js";
import { ACTORMODELS } from "./data-models/actor/actor-data-model.js";
import { ITEMMODELS } from "./data-models/item/item-data-model.js";
import SmtActorSheet from "./documents/actor/actor-sheet.js";
import SmtActor from "./documents/actor/actor.js";
import SmtItemSheet from "./documents/item/item-sheet.js";
import { SmtItem } from "./documents/item/item.js";

declare global {
  interface Game {
    smt: {
      SmtActor: typeof SmtActor;
      SmtItem: typeof SmtItem;
    };
  }

  interface CONFIG {
    SMT: typeof SMT;
  }
}

Hooks.once("init", async () => {
  console.log("SMT | Initializing SMT:TC game system");

  // Set up global configuration
  CONFIG.ActiveEffect.legacyTransferral = false;
  CONFIG.SMT = SMT;
  game.smt = { SmtActor, SmtItem };

  registerDataModels();
  registerDocumentClasses();
  registerSheetApplications();
  registerSystemSettings();
  registerHooks();
  registerModuleAPIs();
  registerHandlebarsHelpers();

  configureStatusEffects();

  await preloadHandlebarsTemplates();
});

function registerDataModels() {
  CONFIG.Item.dataModels = ITEMMODELS;
  CONFIG.Actor.dataModels = ACTORMODELS;
}

function registerDocumentClasses() {
  CONFIG.Actor.documentClass = SmtActor;
  CONFIG.Item.documentClass = SmtItem;
}

function registerSheetApplications() {
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("smt-tc", SmtActorSheet, {
    types: Object.keys(CONFIG.SMT.characterClasses),
    makeDefault: true,
  });

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("smt-tc", SmtItemSheet, {
    types: Object.keys(CONFIG.SMT.itemTypes),
    makeDefault: true,
  });
}

function registerHooks() {
  Hooks.on("createActor", createBasicStrike);
}

function registerHandlebarsHelpers() {
  Handlebars.registerHelper("incrementKey", (keyIn: string) => {
    const key = parseInt(keyIn ?? "0") || 0;

    return `${key + 1}`;
  });
}

async function preloadHandlebarsTemplates() {
  await loadTemplates(SMT.templatePaths);
}
