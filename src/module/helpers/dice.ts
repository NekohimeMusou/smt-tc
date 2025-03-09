import AttackDataModel from "../data-models/embedded/attack.js";
import { SmtItem } from "../documents/item/item.js";

interface HitCheckData {
  tn?: number;
  autoFailThreshold?: number;
  critBoost?: boolean;
}

interface HitCheckResult {
  successLevel: SuccessLevel;
  roll: Roll;
}

interface PowerRollData {
  basePower?: number;
  potency?: number;
  potencyMod?: number;
  powerBoost?: boolean;
  criticalHit?: boolean;
}

interface PowerRollResult {
  power: number;
  roll: Roll;
}

interface ItemRollData {
  item?: SmtItem;
  tnMod?: number;
  potencyMod?: number;
}

export default class SmtDice {
  static async hitCheck({
    tn = 1,
    autoFailThreshold = CONFIG.SMT.defaultAutofailThreshold,
    critBoost = false,
  }: HitCheckData = {}): Promise<HitCheckResult> {
    const critDivisor = critBoost ? 5 : 10;

    const critThreshold = Math.floor(tn / critDivisor);

    const roll = await new Roll("1d100").roll();
    const total = roll.total;

    let successLevel: SuccessLevel = "autofail";

    if (total >= 100) {
      // Fumble
      successLevel = "fumble";
    } else if (total <= critThreshold) {
      successLevel = "crit";
    } else if (total <= tn) {
      successLevel = "success";
    } else if (total < autoFailThreshold) {
      successLevel = "fail";
    }

    return { successLevel, roll };
  }

  static async powerRoll({
    basePower = 0,
    potency = 0,
    potencyMod = 0,
    powerBoost = false,
    criticalHit = false,
  }: PowerRollData = {}): Promise<PowerRollResult> {
    const dice = powerBoost ? 2 : 1;
    const potencyModString = potencyMod ? ` + ${potencyMod}` : "";
    const baseRollString = `${dice}d10x + ${basePower} + ${potency}${potencyModString}`;
    const rollString = criticalHit
      ? `(${baseRollString}) * 2`
      : `${baseRollString}`;

    const roll = await new Roll(rollString).roll();

    return { power: roll.total, roll };
  }

  static async itemRoll({
    item,
    tnMod = 0,
    potencyMod = 0,
  }: ItemRollData = {}) {
    const actor = item?.parent;

    if (!item || !actor) {
      const msg = game.i18n.localize("SMT.error.MissingItem");
      ui.notifications.error(msg);
      throw new TypeError(msg);
    }

    const attackName = item.name;
    const description = item.system.description;

    const context = { attackName, description };

    if (["inventoryItem", "weapon", "skill"].includes(item.type)) {
      // It's an attack
      //@ts-expect-error This should work, there's a bug in the Typescript typedefs
      const attackData = (item.system.attackData as AttackDataModel)
        ._systemData;

      const rolls: Roll[] = [];
      let criticalHit = false;
      let successLevel = "success";

      // Make a hit check, if applicable
      if (!attackData.auto) {
        const tn = Math.max(attackData.tn + tnMod, 1);
        const critBoost = attackData.critBoost;
        const autoFailThreshold = attackData.autoFailThreshold;

        const { successLevel: success, roll } = await this.hitCheck({
          tn,
          critBoost,
          autoFailThreshold,
        });

        successLevel = success;

        criticalHit = successLevel === "crit";

        rolls.push(roll);

        foundry.utils.mergeObject(context, {
          displayHitCheck: true,
          tn,
          criticalHit,
          autoFailThreshold,
        });
      }

      // Make a power roll, if applicable
      if (attackData.includePowerRoll) {
        const basePower = attackData.basePower;
        const potency = attackData.potency;
        const powerBoost = attackData.powerBoost;

        const { power, roll } = await this.powerRoll({
          basePower,
          potency,
          potencyMod,
          powerBoost,
          criticalHit,
        });

        rolls.push(roll);

        foundry.utils.mergeObject(context, {
          displayPowerRoll: true,
          potency: potency + potencyMod,
          power,
          critPower: criticalHit ? power * 2 : power,
        });
      }

      // Display ailment info, if applicable
      if (attackData.ailment.id) {
        const critMultiplier = criticalHit ? 2 : 1;
        const ailmentId = attackData.ailment.id;
        const ailmentRate = Math.clamp(
          attackData.ailment.rate * critMultiplier,
          5,
          95,
        );

        foundry.utils.mergeObject(context, {
          ailmentId,
          ailmentRate,
        });
      }
    }

    const template = "systems/smt-tc/templates/chat/item-roll-card.hbs";
    const content = await renderTemplate(template, context);

    const chatData = {
      author: game.user.id,
      content,
      speaker: {
        scene: game.scenes.current,
        actor,
        token: actor.token,
      },
    };

    return await ChatMessage.create(chatData);
  }
}
