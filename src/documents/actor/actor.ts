import { ACTORMODELS } from "../../data-models/actor/actor-data-model.js";
import { SmtActiveEffect } from "../active-effect.js";
import { SmtItem } from "../item/item.js";

export type Fiend = Subtype<SmtActor, "fiend">;

export class SmtActor extends Actor<
  typeof ACTORMODELS,
  SmtItem,
  SmtActiveEffect
> {}
