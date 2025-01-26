import {
  onManageActiveEffect,
  prepareActiveEffectCategories,
} from "../../config/active-effects.js";
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

  override async getData() {
    const context = super.getData();

    const data = this.actor.system;
    const rollData = this.actor.getRollData();

    const skills = this.actor.items.find((item) => item.type === "skill");
    const meleeWeapons = this.actor.items.find((item) => item.type === "melee");
    const guns = this.actor.items.find((item) => item.type === "gun");
    const armor = this.actor.items.find((item) => item.type === "armor");
    const items = this.actor.items.find((item) => item.type === "item");
    const magatama = this.actor.items.find((item) => item.type === "magatama");

    const effects = prepareActiveEffectCategories(this.actor.effects);

    await foundry.utils.mergeObject(context, {
      data,
      rollData,
      skills,
      meleeWeapons,
      guns,
      armor,
      items,
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

    html.find(".item-update").on("change", this.#onItemUpdate.bind(this));

    // Active Effect management
    html
      .find(".effect-control")
      .on("click", (ev) => onManageActiveEffect(ev, this.actor));
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

  async #onItemUpdate(event: JQuery.ChangeEvent) {
    event.preventDefault();

    const element = $(event.currentTarget);
    const itemId = element.closest(".item").data("itemId") as string;
    const item = this.actor.items.get(itemId);

    if (!item) return;

    const dtype = element.data("dtype") as string;
    const fieldName = element.data("fieldName") as string;

    let newValue: boolean | string | number;

    if (dtype === "Boolean") {
      newValue = !(element.data("checked") as boolean);
    } else {
      newValue = element.val() as string | number;
    }

    // TODO: Handle equipping/unequipping from sheet
    // if (fieldName === "system.equipped" && newValue) {
    //   const equipSlot = item.system.equipSlot;

    //   const previousEquipment = this.actor.items.find(
    //     (it) =>
    //       it.system.itemType === "equipment" &&
    //       it.system.equipSlot === equipSlot &&
    //       it.system.equipped,
    //   );

    //   if (previousEquipment) {
    //     await previousEquipment.update({ "system.equipped": false });
    //   }
    // }

    const updates = Object.fromEntries([[fieldName, newValue]]);

    await item.update(updates);
  }
}
