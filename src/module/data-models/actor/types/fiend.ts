import { Fiend } from "../../../document/actor/actor.js";
import { Magatama } from "../../../document/item/item.js";
import { SmtBaseActorData } from "../abstract/base.js";

export class SmtFiendData extends SmtBaseActorData {
  override readonly type = "fiend";

  override prepareBaseData() {
    super.prepareBaseData();

    const actor = this.parent as Fiend;
    const data = this._systemData;

    const equippedMagatama = actor.items.find(
      (item) => item.system.type === "magatama" && item.system.equipped,
    ) as Magatama | undefined;

    if (equippedMagatama) {
      const magatamaStats = equippedMagatama.system.stats;

      Object.entries(magatamaStats).forEach(([key, value]) => {
        const stat = key as CharacterStat;
        // Fiends always have base stats of 2 across the board
        data.stats[stat].base = 2;
        data.stats[stat].value += value;
      });

      // Apply affinities from magatama
      const magatamaAffinities = equippedMagatama.system.affinities;

      Object.entries(magatamaAffinities).forEach(([key, affinity]) => {
        const affinityName = key as keyof typeof data.affinities;
        data.affinities[affinityName] = affinity;
      });
    }
  }
}
