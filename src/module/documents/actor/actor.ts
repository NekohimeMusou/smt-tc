import { ailmentData } from "../../config/statuses.js";
import { ACTORMODELS } from "../../data-models/actor/actor-data-model.js";
import { renderFountainDialog } from "../../helpers/dialog.js";
import SmtActiveEffect from "../active-effect/active-effect.js";
import { SmtItem } from "../item/item.js";

export type Fiend = Subtype<SmtActor, "fiend">;
export type Demon = Subtype<SmtActor, "demon">;
export type Human = Subtype<SmtActor, "human">;

type HealResult = "notEnoughMacca" | "healed" | "alreadyFull";

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
      result = "notEnoughMacca";
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

  async healingFountain() {
    const { value: hp, max: maxHp } = this.system.hp;
    const { value: mp, max: maxMp } = this.system.mp;
    const macca = this.system.macca;

    if (hp === maxHp && mp === maxMp) {
      return ui.notifications.notify(game.i18n.localize("SMT.macro.fountain.noHealingNeeded"));
    }

    const hpHealed = Math.max(maxHp - hp, 0);
    const mpHealed = Math.max(maxMp - mp, 0);

    const { healed, insufficientMacca, cost } = await renderFountainDialog({
      hp: hpHealed,
      mp: mpHealed,
      macca,
    });

    if (insufficientMacca) {
      ui.notifications.notify(game.i18n.localize("SMT.macro.fountain.insufficientMacca"));
    } else if (healed) {
      await this.update({
        "system.hp.value": maxHp,
        "system.mp.value": maxMp,
        "system.macca": macca - (cost ?? 0)
      });

      const template =
        "systems/smt-tc/templates/chat/macro/fountain-of-life.hbs";

      const content = await renderTemplate(template, {
        name: this.name,
        cost,
        hp: hpHealed,
        mp: mpHealed,
      });

      const chatData = {
        author: game.user.id,
        content,
        speaker: {
          scene: game.scenes.current,
          alias: game.i18n.localize("SMT.macro.fountain.lady"),
        },
      };

      return await ChatMessage.create(chatData);
    }
  }
}
