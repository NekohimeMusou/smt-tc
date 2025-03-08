import SmtActor from "../documents/actor/actor.js";
import { SmtItem } from "../documents/item/item.js";

export default abstract class BaseEmbeddedDataModel extends foundry.abstract
  .DataModel {
  get actor() {
    return this.#getClosestParent(SmtActor);
  }

  get item() {
    return this.#getClosestParent(SmtItem);
  }

  #getClosestParent(document: typeof SmtActor | typeof SmtItem) {
    let parent = this.parent;

    while (parent) {
      if (parent instanceof document) {
        break;
      }

      parent = parent.parent;
    }

    return parent;
  }
}
