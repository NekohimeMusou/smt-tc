import AttackDataModel from "../data-models/embedded/attack.js";
import { AttackItem, SmtItem } from "../documents/item/item.js";

interface HitCheckData {
  tn?: number;
  autoFailThreshold?: number;
  critBoost?: boolean;
}

interface HitCheckResult {
  successLevel: SuccessLevel;
  criticalHit: boolean;
  fumble: boolean;
  roll: Roll;
}

interface PowerRollData {
  basePower?: number;
  potency?: number;
  potencyMod?: number;
  powerBoost?: boolean;
}

interface PowerRollResult {
  power: number;
  critPower: number;
  roll: Roll;
}

interface ItemRollData {
  item?: SmtItem;
  targets?: string[];
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

    return {
      successLevel,
      criticalHit: successLevel === "crit",
      fumble: successLevel === "fumble",
      roll,
    };
  }

  static async powerRoll({
    basePower = 0,
    potency = 0,
    potencyMod = 0,
    powerBoost = false,
  }: PowerRollData = {}): Promise<PowerRollResult> {
    const dice = powerBoost ? 2 : 1;
    const potencyModString = potencyMod ? ` + ${potencyMod}` : "";
    const rollString = `${dice}d10x + ${basePower} + ${potency}${potencyModString}`;

    const roll = await new Roll(rollString).roll();
    const power = Math.max(roll.total, 0);

    return { power, critPower: power * 2, roll };
  }

  static async itemRoll({
    item,
    targets,
    tnMod = 0,
    potencyMod = 0,
  }: ItemRollData = {}) {
    const actor = item?.parent;

    if (!item || !actor) {
      const msg = game.i18n.localize("SMT.error.MissingItem");
      ui.notifications.error(msg);
      throw new TypeError(msg);
    }

    const itemData = item.system;

    // General stuff
    const itemName = item.name;
    const description = itemData.description;

    // Can we pay the item's cost?
    const costType = itemData.costType;
    const costPaid = await item.payCost();

    const rolls: Roll[] = [];

    // @ts-expect-error This should work, there's a bug in the Typescript typedefs
    const attackItem = (item as AttackItem).system?.attackData as
      | AttackDataModel
      | undefined;

    const attackData = attackItem?._systemData;

    const auto = attackData?.auto ?? true;
    const hasPowerRoll = attackData?.hasPowerRoll;

    // TODO: Find a less slapdash way to handle this
    const pinhole = attackData?.mods.pinhole;
    const pierce = attackData?.pierce;

    const context = {
      itemName,
      targets,
      description,
      costType,
      cost: item.system.cost,
      costPaid,
      auto,
      successLevel: costPaid ? "auto" : "fail",
      success: costPaid,
      fumble: false,
      criticalHit: false,
      hasPowerRoll,
      canDodge: attackData?.canDodge ?? false,
      pinhole,
      pierce,
    };

    if (!auto && attackData && costPaid) {
      const tn = Math.max(attackData.tn + tnMod, 1);
      const critBoost = attackData.critBoost;
      const autoFailThreshold = attackData.autoFailThreshold;

      const { successLevel, criticalHit, fumble, roll } = await this.hitCheck({
        tn,
        critBoost,
        autoFailThreshold,
      });

      rolls.push(roll);

      foundry.utils.mergeObject(context, {
        successLevel,
        autoFailThreshold,
        success: ["success", "crit", "auto"].includes(successLevel),
        fumble,
        criticalHit,
        successRoll: await roll.render(),
      });
    }

    const success = context.success;
    const fumble = context.fumble;

    // Success assumes the cost was paid
    if ((success || fumble) && hasPowerRoll) {
      // Lazy typescript hack
      const affinity =
        attackData.affinity as keyof typeof actor.system.elementBoost;
      const elementBoost = actor.system.elementBoost?.[affinity];
      const basePower = elementBoost
        ? Math.floor(attackData.basePower * 1.5)
        : attackData.basePower;
      const potency = attackData.potency;
      const powerBoost = attackData.powerBoost;

      const { power, critPower, roll } = await this.powerRoll({
        basePower,
        potency,
        potencyMod,
        powerBoost,
      });

      rolls.push(roll);

      foundry.utils.mergeObject(context, {
        potency: potency + potencyMod,
        power,
        critPower,
        powerRoll: await roll.render(),
      });
    }

    // Add ailment info, if applicable
    if (success && attackData?.ailment.id) {
      const ailment = attackData.ailment;

      const ailmentCritRate = Math.clamp(ailment.rate * 2, 5, 95);

      foundry.utils.mergeObject(context, {
        ailment,
        ailmentCritRate,
      });
    }

    const template = "systems/smt-tc/templates/chat/item-roll-card.hbs";
    const content = await renderTemplate(template, context);

    const chatData = {
      author: game.user.id,
      content,
      speaker: {
        scene: game.scenes.current,
        actor: actor,
        token: actor.token,
      },
      rolls,
    };

    return await ChatMessage.create(chatData);
  }
}
