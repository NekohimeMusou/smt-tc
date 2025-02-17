import { ITEMMODELS } from "../../data-models/item/item-data-model.js";
import { SmtActiveEffect } from "../active-effect.js";
import { SmtActor } from "../actor/actor.js";

export class SmtItem extends Item<
  typeof ITEMMODELS,
  SmtActor,
  SmtActiveEffect
> {}
