import SmtActor from "../actor/actor.js";
import SmtItem from "../item/item.js";

export default class SmtActiveEffect extends ActiveEffect<SmtActor, SmtItem> {
  override isSuppressed() {
    const parent = this.parent;

    if (parent.documentName === "Actor") {
      return false;
    }

    // It's an item
    if (parent.documentName === "Item") {
      const item = parent as SmtItem;

      return item.system.equippable && !item.system.equipped;
    }

    return false;
  }
}
