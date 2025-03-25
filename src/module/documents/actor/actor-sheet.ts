import { showAttackModifierDialog } from "../../helpers/dialog.js";
import SmtDice from "../../helpers/dice.js";
import { prepareActiveEffectCategories } from "../active-effect/helpers.js";
import { onManageActiveEffect } from "../active-effect/helpers.js";
import SmtActor from "./actor.js";
import { Armor, AttackItem, InventoryItem } from "../item/item.js";
import SmtToken from "../token.js";

export default class SmtActorSheet extends ActorSheet<SmtActor> {
  static override get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["smt-tc", "sheet", "actor"],
      template: "systems/smt-tc/templates/actor/actor-sheet.hbs",
      width: 850,
      height: 950,
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

    const magatama = this.actor.items.filter(
      (item) => item.type === "magatama",
    );

    const skills = this.actor.items.filter(
      (item) => item.type === "skill" && item.name === "Basic Strike",
    );

    skills.push(
      ...this.actor.items.filter(
        (item) => item.type === "skill" && item.name !== "Basic Strike",
      ),
    );
    const weapons = this.actor.items.filter((item) => item.type === "weapon");
    const equippedWeapons = weapons.filter((item) => item.system.equipped);
    const showWeaponsPane = equippedWeapons.length > 0;
    const armor = this.actor.items.filter((item) => item.type === "armor");
    const inventoryItems = this.actor.items.filter(
      (item) => item.type === "inventoryItem",
    );

    const equippedMagatama = magatama.find((item) => item.system.equipped);

    const effects = prepareActiveEffectCategories(this.actor.effects);

    // FIXTHIS: Cheap hack because I'm bad at CSS, fix later
    const gems = Object.keys(CONFIG.SMT.gems);
    const gems1 = gems.slice(0, 7);
    const gems2 = gems.slice(7);

    const editableActorSheetBuffs = game.settings.get(
      "smt-tc",
      "editableActorSheetBuffs",
    );

    const editableGems =
      (game.settings.get("smt-tc", "editableGems") ?? false) || game.user.isGM;

    await foundry.utils.mergeObject(context, {
      system,
      rollData,
      magatama,
      skills,
      weapons,
      equippedWeapons,
      showWeaponsPane,
      armor,
      inventoryItems,
      equippedMagatama,
      effects,
      gems: [gems1, gems2],
      editableActorSheetBuffs,
      editableGems,
      SMT: CONFIG.SMT,
    });

    return context;
  }

  // override async _onDropItem(_event: Event, itemD: unknown) {
  //   // @ts-expect-error Copied from Persona system
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  //   const item: SmtItem = await Item.implementation.fromDropData(itemD);
  //   console.debug(`${item.type} dropped on sheet of ${this.actor.name}`);

  //   switch (item.type) {
  //     case "skill":
  //       return super._onDropItem(_event, itemD);
  //     case "armor":
  //     case "inventoryItem":
  //     case "magatama":
  //     case "weapon":
  //       if (!game.user.isGM) {
  //         const msg = game.i18n.localize("SMT.error.useItemPiles");
  //         ui.notifications.warn(msg);
  //         return undefined;
  //       }

  //       const existing = this.actor.items.find(
  //         (x) =>
  //           x.type === item.type && "qty" in x.system && x.name == item.name,
  //       );

  //       if (existing != undefined && existing.type === "inventoryItem") {
  //         console.log("Adding to existing amount");
  //         await existing.addItemsToStack(1);
  //         return existing;
  //       }
  //       return super._onDropItem(_event, itemD);
  //     default:
  //       item.type satisfies never;
  //       throw new Error("Unknown item type");
  //   }
  // }

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

    // Adjust the TN Boost or Multi fields
    html
      .find(".adjust-sheet-mod")
      .on("click", this.#onSheetModChange.bind(this));

    // Toggle an item field from an actor sheet, e.g. equipping an item
    html
      .find(".item-field-toggle")
      .on("change", this.#onItemFieldToggle.bind(this));

    // Rolling an item (skill, weapon, etc)
    html.find(".item-roll").on("click", this.#onItemRoll.bind(this));

    // Test new sheet rolls
    html.find(".sheet-roll").on("click", this.#onSheetRoll.bind(this));
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
      type: itemType,
      system,
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.system.itemType;

    // Finally, create the item!
    await this.actor.createEmbeddedDocuments("Item", [itemData]);
  }

  async #onItemDelete(event: JQuery.ClickEvent) {
    const li = $(event.currentTarget).parents(".item");
    const itemId = li.data("itemId") as string;
    const item = this.actor.items.get(itemId);

    if (!item) return;

    const confirmDelete = (await Dialog.confirm({
      title: game.i18n.localize("SMT.dialog.confirmDeleteTitle"),
      content: `<p>${game.i18n.format("SMT.dialog.confirmDeletePrompt", { name: item.name })}</p>`,
      yes: () => true,
      no: () => false,
      defaultYes: false,
    })) as boolean;

    if (!confirmDelete) return;

    await item.delete();
    li.slideUp(200, () => this.render(false));
  }

  async #onSheetRoll(event: JQuery.ClickEvent) {
    event.preventDefault();
    const target = $(event.currentTarget);

    const tnType = target.data("tnType") as TargetNumber | undefined;
    const attackType = target.data("attackType") as AttackType | undefined;

    if (!tnType && !attackType) {
      const msg = game.i18n.localize("SMT.error.missingPowerType");
      ui.notifications.error(msg);
      throw new TypeError(msg);
    }

    const showDialog =
      event.shiftKey != game.settings.get("smt-tc", "showRollDialogByDefault");

    const checkName = game.i18n.localize(
      tnType ? `SMT.tn.${tnType}` : `SMT.power.${attackType}`,
    );

    const { tnMod, potencyMod, cancelled } = showDialog
      ? await showAttackModifierDialog(checkName)
      : { tnMod: 0, potencyMod: 0, cancelled: false };

    if (cancelled) {
      return;
    }

    return await SmtDice.sheetRoll({
      actor: this.actor,
      tnType,
      attackType,
      checkName,
      tnMod,
      potencyMod,
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

  async #onItemFieldToggle(event: JQuery.ChangeEvent) {
    event.preventDefault();

    const element = $(event.currentTarget);
    const itemId = element.closest(".item").data("itemId") as string;
    const fieldId = element.data("fieldId") as string | undefined;
    const item = this.actor.items.get(itemId);

    if (!item) {
      const msg = game.i18n.localize("SMT.error.missingItem");
      ui.notifications.error(msg);
      throw new TypeError(msg);
    }

    if (!fieldId) {
      const msg = game.i18n.localize("SMT.error.missingItem");
      ui.notifications.error(msg);
      throw new TypeError(msg);
    }

    const newState = element.is(":checked");

    const equippingMagatama =
      item.type === "magatama" && fieldId === "equipped";
    const originalMaxHp = this.actor.system.hp.max;
    const originalMaxMp = this.actor.system.mp.max;

    // If we're equipping a magatama, unequip other magatama
    if (equippingMagatama && newState) {
      await Promise.all(
        this.actor.items
          .filter((item) => item.type === "magatama" && item.system.equipped)
          .map(async (item) => await item.toggleField(fieldId, false)),
      );
    }

    // If we're equipping armor, unequip other armor in the same slot
    if (item.type === "armor" && fieldId === "equipped" && newState) {
      await Promise.all(
        this.actor.items
          .filter(
            (actorItem) =>
              (actorItem as Armor | undefined)?.system.slot ===
                (item as Armor | undefined)?.system.slot &&
              actorItem.system.equipped,
          )
          .map(async (item) => await item.toggleField(fieldId, false)),
      );
    }

    await item.toggleField(fieldId, newState);

    if (equippingMagatama) {
      const newMaxHp = this.actor.system.hp.max;
      const newMaxMp = this.actor.system.mp.max;

      if (newMaxHp !== originalMaxHp) {
        const newHpValue = newMaxHp - originalMaxHp;
        await this.actor.update({
          "system.hp.value": this.actor.system.hp.value + newHpValue,
        });
      }

      if (newMaxMp !== originalMaxMp) {
        const newMpValue = newMaxMp - originalMaxMp;
        await this.actor.update({
          "system.mp.value": this.actor.system.mp.value + newMpValue,
        });
      }
    }
  }

  async #onItemRoll(event: JQuery.ClickEvent) {
    event.preventDefault();

    const element = $(event.currentTarget);
    const itemId = element.closest(".item").data("itemId") as
      | string
      | undefined;
    const item = this.actor.items.get(itemId ?? "");

    if (!item) {
      const msg = game.i18n.localize("SMT.error.missingItem");
      ui.notifications.error(msg);
      throw new Error(msg);
    }

    const targets =
      game.user.targets.size > 0
        ? ([...game.user.targets.values()] as SmtToken[]).map((token) => ({
            token,
            name: token.name,
            resist: token.actor.system.resist,
            fly: token.actor.statuses.has("fly"),
            affinities: token.actor.system.affinities,
          }))
        : undefined;

    const isAttackItem = item.isAttackItem();

    const auto = !isAttackItem || item.system.attackData.auto;

    const consumeOnUse = (item as InventoryItem).system?.consumeOnUse;

    const hasPowerRoll = (item as AttackItem).system?.attackData.hasPowerRoll;

    // Is the user signaling to show the dialog?
    const dialogKey =
      event.shiftKey != game.settings.get("smt-tc", "showRollDialogByDefault");

    // Show the dialog anyway if it's a consumable item
    const showDialog = consumeOnUse || dialogKey;

    const { tnMod, potencyMod, cancelled } = showDialog
      ? await showAttackModifierDialog(
          item.name,
          item.system.description,
          auto,
          consumeOnUse,
          hasPowerRoll,
        )
      : { tnMod: 0, potencyMod: 0, cancelled: false };

    if (cancelled) {
      return;
    }

    return await SmtDice.itemRoll({
      item,
      targets,
      tnMod,
      potencyMod,
    });
  }
}
