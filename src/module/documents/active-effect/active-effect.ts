import SmtActor from "../actor/actor.js";
import { SmtItem } from "../item/item.js";

export default class SmtActiveEffect extends ActiveEffect<SmtActor, SmtItem> {
  override isSuppressed() {
    const parent = this.parent;

    if (parent instanceof SmtActor) {
      return false;
    }

    // It's an item
    if (parent instanceof SmtItem) {
      return parent.system.equippable && !parent.system.equipped;
    }

    return false;
  }
}
