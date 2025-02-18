import { showHitCheckCard, showPowerRollCard } from "../../helpers/chat.js";
import { hitCheck, powerRoll } from "../../helpers/dice.js";
import {
  onManageActiveEffect,
  prepareActiveEffectCategories,
} from "../active-effect.js";
import { SmtActor } from "./actor.js";

export default class SmtActorSheet extends ActorSheet<SmtActor> {
  static override get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["smt-tc", "sheet", "actor"],
      template: "systems/smt-tc/templates/actor/actor-sheet.hbs",
      width: 800,
      height: 800,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "main",
        },
      ],
    });
  }

  override get template() {
    const basePath = "systems/smt-tc/templates/actor";

    return `${basePath}/actor-${this.actor.type}-sheet.hbs`;
  }

  override async getData() {
    const context = super.getData();
    const system = this.actor.system;
    const rollData = this.actor.getRollData();

    const magatama = this.actor.items.find((item) => item.type === "magatama");

    const effects = prepareActiveEffectCategories(this.actor.effects);

    await foundry.utils.mergeObject(context, {
      system,
      rollData,
      magatama,
      effects,
      SMT: CONFIG.SMT,
    });

    return context;
  }

  override activateListeners(html: JQuery<HTMLElement>) {
    super.activateListeners(html);

    // Render the item sheet for viewing/editing prior to the editable check.
    html.find(".item-edit").on("click", async (ev) => {
      const li = $(ev.currentTarget).parents(".item");
      const itemId = li.data("itemId") as string;
      const item = this.actor.items.get(itemId);
      if (item) {
        await item.sheet.render(true);
      }
    });

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add Inventory Item
    html.find(".item-create").on("click", this.#onItemCreate.bind(this));

    // Delete Inventory Item
    html.find(".item-delete").on("click", this.#onItemDelete.bind(this));

    // Active Effect management
    html
      .find(".effect-control")
      .on("click", (ev) => onManageActiveEffect(ev, this.actor));

    // Stat rolls
    html.find(".hit-roll").on("click", this.#onHitRoll.bind(this));
    html.find(".power-roll").on("click", this.#onPowerRoll.bind(this));
    html
      .find(".adjust-sheet-mod")
      .on("click", this.#onSheetModChange.bind(this));
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  async #onItemCreate(event: JQuery.ClickEvent) {
    event.preventDefault();
    const element = $(event.currentTarget);
    // Get the type of item to create.
    const system = element.data();
    // Grab any data associated with this control.
    const itemType = system.itemType as string;
    // Initialize a default name.
    const name = itemType.replace(/\b\w+/g, function (s) {
      return s.charAt(0).toUpperCase() + s.substring(1).toLowerCase();
    });
    const itemName = `${game.i18n.format("SMT.sheet.newItem", { name })}`;
    // Prepare the item object.
    const itemData = {
      name: itemName,
      type: "unstackable",
      system,
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    // delete itemData.system.type;

    // Finally, create the item!
    await this.actor.createEmbeddedDocuments("Item", [itemData]);
  }

  async #onItemDelete(event: JQuery.ClickEvent) {
    const li = $(event.currentTarget).parents(".item");
    const itemId = li.data("itemId") as string;
    const item = this.actor.items.get(itemId);

    if (!item) return;

    const confirmDelete = (await Dialog.confirm({
      title: game.i18n.localize("SMT.dialog.confirmDeleteDialogTitle"),
      content: `<p>${game.i18n.format("SMT.dialog.confirmDeletePrompt", { name: item.name })}</p>`,
      yes: () => true,
      no: () => false,
      defaultYes: false,
    })) as boolean;

    if (!confirmDelete) return;

    await item.delete();
    li.slideUp(200, () => this.render(false));
  }

  async #onHitRoll(event: JQuery.ClickEvent) {
    event.preventDefault();
    const target = $(event.currentTarget);
    const actorData = this.actor.system;

    const tnType = target.data("tnType") as TargetNumber | undefined;

    if (!tnType) {
      const msg = game.i18n.localize("SMT.error.missingHitRollTN");
      throw new TypeError(msg);
    }

    const tnLabel = game.i18n.localize(`SMT.tn.${tnType}`);

    const checkName = game.i18n.format("SMT.diceOutput.checkName", {
      name: tnLabel,
    });
    const tn = actorData.tn[tnType];
    const autoFailThreshold = actorData.autoFailThreshold;
    const critBoost = tnType === "physAtk" && actorData.mods.might;

    const { successLevel, roll } = await hitCheck({
      tn,
      autoFailThreshold,
      critBoost,
    });

    // Show chat card
    await showHitCheckCard({
      actor: this.actor,
      token: this.actor.token,
      checkName,
      tn,
      successLevel,
      roll,
    });
  }

  async #onPowerRoll(event: JQuery.ClickEvent) {
    event.preventDefault();

    const powerType = $(event.currentTarget).data("powerType") as
      | PowerType
      | undefined;

    if (!powerType) {
      const msg = game.i18n.localize("SMT.error.missingPowerType");
      throw new TypeError(msg);
    }

    const actorData = this.actor.system;

    const basePower = actorData.power[powerType];
    const powerBoost = actorData.powerBoost[powerType];

    const { power, roll } = await powerRoll({ basePower, powerBoost });

    // Show chat card
    await showPowerRollCard({
      actor: this.actor,
      token: this.actor.token,
      power,
      powerType,
      roll,
    });
  }

  async #onSheetModChange(event: JQuery.ClickEvent) {
    event.preventDefault();

    const { direction, field, min, max } = $(event.currentTarget).data() as {
      direction: "+" | "-";
      field: "multi" | "tnBoosts";
      min: string | undefined;
      max: string | undefined;
    };

    const increment = direction === "+" ? 1 : -1;

    let newBonus = this.actor.system[field] + increment;

    if (min != undefined) {
      const minimum = parseInt(min) || 0;
      if (newBonus < minimum) {
        newBonus = minimum;
      }
    }

    if (max != undefined) {
      const maximum = parseInt(max) || 0;
      if (newBonus > maximum) {
        newBonus = maximum;
      }
    }

    const data = Object.fromEntries([[`system.${field}`, newBonus]]);

    await this.actor.update(data);
  }
}
