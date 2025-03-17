import { ailmentData } from "../../config/statuses.js";
import { ACTORMODELS } from "../../data-models/actor/actor-data-model.js";
import SmtActiveEffect from "../active-effect/active-effect.js";
import { SmtItem } from "../item/item.js";

export type Fiend = Subtype<SmtActor, "fiend">;
export type Demon = Subtype<SmtActor, "demon">;
export type Human = Subtype<SmtActor, "human">;

type HealResult = "insufficientMacca" | "healed" | "alreadyFull";

interface HealingFountainResult {
  name: string;
  result: HealResult;
  hpHealed: number;
  mpHealed: number;
  cost: number;
}

export default class SmtActor extends Actor<
  typeof ACTORMODELS,
  SmtItem,
  SmtActiveEffect
> {
  async inflictAilment(id: AilmentId): Promise<boolean> {
    const newAilment = ailmentData.find((ailment) => ailment.id === id);
    if (!newAilment) {
      return false;
    }

    const currentAilment = ailmentData.find((ailment) =>
      this.statuses.has(ailment.id),
    );

    if (!currentAilment) {
      await this.toggleStatusEffect(id, { overlay: false, active: true });
      return true;
    }
    const currentAilmentPriority = currentAilment.priority;

    const newAilmentPriority = newAilment.priority;

    const replaceAilment = newAilmentPriority < currentAilmentPriority;

    if (replaceAilment) {
      await this.toggleStatusEffect(currentAilment?.id ?? "", {
        overlay: false,
        active: false,
      });
      await this.toggleStatusEffect(newAilment?.id ?? "", {
        overlay: false,
        active: true,
      });

      return true;
    }

    return false;
  }

  async applyHealingFountain(): Promise<HealingFountainResult> {
    const data = this.system;

    const hpHealed = Math.max(data.hp.max - data.hp.value, 0);
    const mpHealed = Math.max(data.mp.max - data.mp.value, 0);

    const cost = hpHealed + mpHealed * 2;

    let result: HealResult = "healed";

    if (cost < 1) {
      result = "alreadyFull";
    } else if (data.macca < cost) {
      result = "insufficientMacca";
    }

    if (result === "healed") {
      const updates = {
        "system.macca": data.macca - cost,
        "system.hp.value": data.hp.max,
        "system.mp.value": data.mp.max,
      };

      await this.update(updates);
    }

    return {
      result,
      hpHealed,
      mpHealed,
      cost,
      name: this.token?.name ?? this.name,
    };
  }
}
