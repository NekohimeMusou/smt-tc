import { ACTORMODELS } from "../../data-models/actor/actor-data-model.js";
import { SmtActiveEffect } from "../active-effect/active-effect.js";
import { SmtItem } from "../item/item.js";

export class SmtActor extends Actor<
  typeof ACTORMODELS,
  SmtItem,
  SmtActiveEffect
> {}
