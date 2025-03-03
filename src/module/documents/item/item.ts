import { ITEMMODELS } from "../../data-models/item/item-data-model.js";
import SmtActiveEffect from "../active-effect/active-effect.js";
import SmtActor from "../actor/actor.js";

export type InventoryItem = Subtype<SmtItem, "inventoryItem">;
export type Weapon = Subtype<SmtItem, "weapon">;
export type Armor = Subtype<SmtItem, "armor">;
export type Magatama = Subtype<SmtItem, "magatama">;
export type Skill = Subtype<SmtItem, "skill">;

export default class SmtItem extends Item<
  typeof ITEMMODELS,
  SmtActor,
  SmtActiveEffect
> {
  async toggleField(fieldId: string, forcedState: boolean) {
    if (!Object.hasOwn(this.system, fieldId)) {
      return;
    }

    //@ts-expect-error no-implicit-any: I'm being real lazy here
    const newState = forcedState || !this.system?.[fieldId];

    const updates = Object.fromEntries([[`system.${fieldId}`, newState]]);

    await this.update(updates);

    return newState;
  }

  async addItemsToStack(qty: number) {
    const data = this.system;

    await this.update({ "system.qty": Math.max(data.qty + qty, 0) });
  }

  async consumeItem() {
    const data = this.system;

    // Don't do anything if there's no actor
    if (!this.parent) {
      return;
    }

    if (data.qty <= 1) {
      await this.delete();
    }

    await this.update({ "system.qty": data.qty - 1 });
  }
}
