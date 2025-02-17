import { SmtActor } from "./actor/actor.js";
import { SmtItem } from "./item/item.js";

export class SmtActiveEffect extends ActiveEffect<SmtActor, SmtItem> {
  override isSuppressed() {
    const parent = this.parent;

    // Is this an actor?
    if (parent.type === "fiend") {
      return false;
    }

    // It's an item; check if it's equipped OR a passive skill
    const item = parent;

    return !item.system.equipped;
  }
}
