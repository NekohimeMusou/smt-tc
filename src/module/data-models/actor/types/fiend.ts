import { Fiend } from "../../../document/actor/actor.js";
import { Magatama } from "../../../document/item/item.js";
import { SmtBaseActorData } from "../abstract/base.js";

export class SmtFiendData extends SmtBaseActorData {
  override readonly type = "fiend";

  override prepareBaseData() {
    super.prepareBaseData();

    const actor = this.parent as Fiend;

    const equippedMagatama = actor.items.find(
      (item) => item.system.type === "magatama" && item.system.equipped,
    ) as Magatama | undefined;

    if (equippedMagatama) {
      const data = this._systemData;
      const magatamaStats = equippedMagatama.system.stats;

      Object.entries(magatamaStats).forEach(([key, value]) => {
        const stat = key as CharacterStat;
        data.stats[stat].value += value;
      });
    }
  }
}
