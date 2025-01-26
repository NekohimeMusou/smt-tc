import { ITEMMODELS } from "../../data-models/item/item-data-model.js";
import { SmtActiveEffect } from "../active-effect/active-effect.js";
import { SmtActor } from "../actor/actor.js";

export type Armor = Subtype<SmtItem, "armor">;
export type Magatama = Subtype<SmtItem, "magatama">;
export type MeleeWeapon = Subtype<SmtItem, "melee">;
export type Gun = Subtype<SmtItem, "gun">;
export type InventoryItem = Subtype<SmtItem, "item">;
export type Skill = Subtype<SmtItem, "skill">;

export class SmtItem extends Item<
  typeof ITEMMODELS,
  SmtActor,
  SmtActiveEffect
> {}
