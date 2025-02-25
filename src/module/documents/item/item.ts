import { ITEMMODELS } from "../../data-models/item/item-data-model.js";
import { SmtActiveEffect } from "../active-effect.js";
import { SmtActor } from "../actor/actor.js";

export type Magatama = Subtype<SmtItem, "magatama">;
export type Skill = Subtype<SmtItem, "skill">;
export type Weapon = Subtype<SmtItem, "weapon">;

export class SmtItem extends Item<
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
}
