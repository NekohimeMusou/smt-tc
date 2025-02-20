import { ITEMMODELS } from "../../data-models/item/item-data-model.js";
import { SmtActiveEffect } from "../active-effect.js";
import { SmtActor } from "../actor/actor.js";

export type Magatama = Subtype<SmtItem, "magatama">;

export class SmtItem extends Item<
  typeof ITEMMODELS,
  SmtActor,
  SmtActiveEffect
> {
  async toggleField(
    fieldId: string,
    forcedState: boolean | undefined = undefined,
  ) {
    const newState = forcedState ?? !this.system.equipped;

    const updates = Object.fromEntries([[fieldId, newState]]);

    await this.update(updates);

    return newState;
  }
}
