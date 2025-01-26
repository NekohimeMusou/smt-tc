import {
  onManageActiveEffect,
  prepareActiveEffectCategories,
} from "../../config/active-effects.js";
import { SmtItem } from "./item.js";

export class SmtItemSheet extends ItemSheet<SmtItem> {
  static override get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["smt-tc", "sheet", "item"],
      width: 800,
      height: 800,
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
    const context = super.getData();

    const data = this.item.system;

    const effects = prepareActiveEffectCategories(this.item.effects);

    await foundry.utils.mergeObject(context, {
      data,
      effects,
      SMT: CONFIG.SMT,
    });

    return context;
  }

  override activateListeners(html: JQuery<HTMLElement>) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Roll handlers, click handlers, etc. would go here.
    // Active Effect management
    html
      .find(".effect-control")
      .on("click", (ev) => onManageActiveEffect(ev, this.item));
  }
}
