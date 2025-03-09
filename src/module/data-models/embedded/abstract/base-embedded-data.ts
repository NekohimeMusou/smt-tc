<<<<<<<< HEAD:src/module/data-models/embedded/base-embedded-data.ts
import SmtActor from "../../documents/actor/actor.js";
import { SmtItem } from "../../documents/item/item.js";
========
import SmtActor from "../../../documents/actor/actor.js";
import { SmtItem } from "../../../documents/item/item.js";
>>>>>>>> 7f839c4 (Reorganize data model folders a little):src/module/data-models/embedded/abstract/base-embedded-data.ts

export default abstract class BaseEmbeddedDataModel extends foundry.abstract
  .DataModel {
  get actor() {
    return this.#getClosestParent(SmtActor) as SmtActor | undefined;
  }

  get item() {
    return this.#getClosestParent(SmtItem) as SmtItem | undefined;
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
