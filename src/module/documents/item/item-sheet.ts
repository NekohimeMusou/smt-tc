import {
  onManageActiveEffect,
  prepareActiveEffectCategories,
} from "../active-effect/helpers.js";
import { SmtItem } from "./item.js";

export default class SmtItemSheet extends ItemSheet<SmtItem> {
  static override get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["smt-tc", "sheet", "item"],
      width: 800,
      height: 600,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "effect",
        },
      ],
    });
  }

  override get template() {
    const basePath = "systems/smt-tc/templates/item";

    return `${basePath}/item-${this.item.type}-sheet.hbs`;
  }

  override async getData() {
    const context = await super.getData();
    const system = this.item.system;

    const enablePierce = game.settings.get("smt-tc", "enablePierce");

    const effects = prepareActiveEffectCategories(this.item.effects);

    foundry.utils.mergeObject(context, {
      system,
      enablePierce,
      effects,
      SMT: CONFIG.SMT,
    });

    return context;
  }

  override activateListeners(html: JQuery<HTMLElement>) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Active Effect management
    html
      .find(".effect-control")
      .on("click", (ev) => onManageActiveEffect(ev, this.item));
  }
}
