import { SMT } from "../../config/config.js";
import { successRoll } from "../../helpers/dice.js";
import { SmtActor } from "./actor.js";

export class SmtActorSheet extends ActorSheet<SmtActor> {
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

    const system = this.actor.system;
    const rollData = this.actor.getRollData();

    // TODO: Figure out active effects in TS
    // const effects = prepareActiveEffectCategories(this.item.effects);

    await foundry.utils.mergeObject(context, {
      system,
      rollData,
      SMT,
    });

    return context;
  }

  override activateListeners(html: JQuery<HTMLElement>) {
    super.activateListeners(html);

    // Render the item sheet for viewing/editing prior to the editable check.
    // html.find(".item-edit").click((ev) => {
    //   const li = $(ev.currentTarget).parents(".item");
    //   const item = this.actor.items.get(li.data("itemId"));
    //   item.sheet.render(true);
    // });

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Stat TN roll
    html.find(".roll-stat-tn").on("click", this.#onStatRoll.bind(this));

    // Add Inventory Item
    // html.find(".item-create").on("click", this.#onItemCreate.bind(this));

    // Delete Inventory Item
    // html.find(".item-delete").on("click", this.#onItemDelete(ev));

    // Active Effect management
    // html.find(".effect-control").on("click", onManageActiveEffect(ev, this.actor));
  }

  async #onStatRoll(event: JQuery.ClickEvent) {
    event.preventDefault();

    const target = $(event.currentTarget);
    const { rollType, stat }: TNRollData = target.data() as TNRollData;

    if (
      !SMT.rollTypes.includes(rollType) ||
      !Object.keys(this.actor.system.stats).includes(stat)
    ) {
      return ui.notifications.error("Malformed roll data (in #onStatRoll)");
    }

    const token = this.actor.token;

    const tn = this.actor.system.stats[stat][rollType];

    const rollLabel = game.i18n.localize(`SMT.stats.${stat}`);

    const showDialog = event.shiftKey != game.settings.get("smt", "invertShiftBehavior");

    return await successRoll(rollLabel, tn, { token, actor: this.actor, showDialog });
  }
  // /**
  //  * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
  //  * @param {Event} event   The originating click event
  //  * @private
  //  */
  // async #onItemCreate(event) {
  //   event.preventDefault();
  //   const element = event.currentTarget;
  //   // Get the type of item to create.
  //   const type = element.dataset.type;
  //   // Grab any data associated with this control.
  //   const system = duplicate(element.dataset);
  //   // Initialize a default name.
  //   const itemName = `${game.i18n.format("SMT.sheet.newItem", { name: type.capitalize() })}`;
  //   // Prepare the item object.
  //   const itemData = {
  //     name: itemName,
  //     type,
  //     system,
  //   };
  //   // Remove the type from the dataset since it's in the itemData.type prop.
  //   delete itemData.system["type"];

  //   // Finally, create the item!
  //   return await Item.create(itemData, { parent: this.actor });
  // }

  // async #onItemDelete(event) {
  //   const li = $(event.currentTarget).parents(".item");
  //   const item = this.actor.items.get(li.data("itemId"));

  //   const confirmDelete = await Dialog.confirm({
  //     title: game.i18n.localize("SMT.dialog.confirmDeleteDialogTitle"),
  //     content: `<p>${game.i18n.format("SMT.dialog.confirmDeletePrompt", { name: item.name })}</p>`,
  //     yes: () => true,
  //     no: () => false,
  //     defaultYes: false,
  //   });

  //   if (!confirmDelete) return;

  //   item.delete();
  //   li.slideUp(200, () => this.render(false));
  // }
}
