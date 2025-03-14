import AttackDataModel from "../data-models/embedded/attack.js";
import SmtActor from "../documents/actor/actor.js";
import { AttackItem, SmtItem } from "../documents/item/item.js";
import { renderItemAttackCard, renderAttackCard } from "./chat.js";

interface HitCheckData {
  tn?: number;
  autoFailThreshold?: number;
  critBoost?: boolean;
  cursed?: boolean;
}

interface HitCheckResult {
  successLevel: SuccessLevel;
  criticalHit: boolean;
  fumble: boolean;
  roll: Roll;
  curseRoll?: Roll;
  curseResult?: boolean;
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
  rollName?: string;
  item?: SmtItem;
  sheetActor?: SmtActor;
  attackType?: AttackType;
  sheetPowerRoll?: boolean;
  targets?: TargetData[];
  tnMod?: number;
  potencyMod?: number;
}

// Quick fix
declare global {
  interface TargetData {
    name: string;
    resist: {
      phys: number;
      mag: number;
    };
    fly: boolean;
  }
}

interface StatRollData {
  actor?: SmtActor;
  checkName?: string;
  tnType?: TargetNumber;
  attackType?: AttackType;
  tnMod?: number;
  potencyMod?: number;
}

interface SheetRollData {
  actor?: SmtActor;
  tnType?: TargetNumber;
  attackType?: AttackType;
  checkName?: string;
  item?: SmtItem;
  tnMod?: number;
  potencyMod?: number;
  targets?: TargetData;
}

interface ItemRollData {
  item?: SmtItem;
}

export default class SmtDice {
  static async hitCheck({
    tn = 1,
    autoFailThreshold = CONFIG.SMT.defaultAutofailThreshold,
    critBoost = false,
    cursed = false,
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

    const data = {
      successLevel,
      criticalHit: successLevel === "crit",
      fumble: successLevel === "fumble",
      roll,
    };

    if (cursed) {
      const curseRoll = await new Roll("1d100").roll();
      const cursed = curseRoll.total <= 30;
      foundry.utils.mergeObject(data, {
        curseRoll,
        cursed,
      });
    }

    return data;
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

  // Main roll
  static async sheetRoll({
    actor,
    tnType,
    attackType,
    // Dialog has been shown at this point
    checkName = "Unknown",
    tnMod = 0,
    potencyMod = 0,
    item,
  }: SheetRollData = {}) {
    if (item) {
      // Call the item roll function
      return;
    } else if (actor && (tnType || attackType)) {
      // Call the stat roll function
      return await this.statRoll({
        actor,
        checkName,
        tnType,
        attackType,
        tnMod,
        potencyMod,
      });
    }

    const msg = game.i18n.localize("SMT.error.missingActor");
    ui.notifications.error(msg);
    throw new TypeError(msg);
  }

  // Sheet roll
  static async statRoll({
    actor,
    checkName,
    tnType,
    attackType,
    tnMod,
    potencyMod,
  }: StatRollData = {}) {
    if (!actor || (!tnType && !attackType) || !checkName) {
      const msg = game.i18n.localize("SMT.error.missingActor");
      ui.notifications.error(msg);
      throw new TypeError(msg);
    }

    const rolls: Roll[] = [];

    const cardData = {
      actor,
      checkName,
      rolls,
    };
    // Make a success roll
    const charData = actor.system;

    let success = true;

    if (tnType) {
      const tn = Math.max(charData.tn[tnType] + (tnMod ?? 0), 1);
      const autoFailThreshold = charData.autoFailThreshold;
      const critBoost =
        (tnType === "gun" || tnType === "phys") && charData.mods.might;
      const cursed = actor.statuses.has("curse");

      const {
        successLevel,
        roll: successRoll,
        curseRoll,
        curseResult,
      } = await this.hitCheck({
        tn,
        critBoost,
        autoFailThreshold,
        cursed,
      });

      rolls.push(successRoll);

      success = successLevel === "success" || successLevel === "crit";

      const successData = {
        successLevel,
        success,
        tn,
        autoFailThreshold,
        successRoll: await successRoll.render(),
      };

      foundry.utils.mergeObject(cardData, { successData });

      if (curseRoll) {
        rolls.push(curseRoll);
        foundry.utils.mergeObject(cardData, {
          successData: {
            curseRoll: await curseRoll.render(),
            curseResult,
          },
        });
      }
    }

    const powerType = attackType ?? tnType ?? "phys";

    const rollPower =
      powerType === "phys" || powerType === "mag" || powerType === "gun";

    if (rollPower && success) {
      const basePower = actor.system.power[powerType];
      const powerBoostType = tnType === "mag" ? "mag" : "phys";
      const powerBoost = actor.system.powerBoost[powerBoostType];

      const {
        power,
        critPower,
        roll: powerDiceRoll,
      } = await this.powerRoll({
        basePower,
        potencyMod,
        powerBoost,
      });

      rolls.push(powerDiceRoll);

      foundry.utils.mergeObject(cardData, {
        powerData: {
          power,
          critPower,
          powerRoll: await powerDiceRoll.render(),
        },
        successData: {
          success,
        },
      });
    }

    await renderAttackCard(cardData);
  }

  // Item roll
  static async itemRoll({
    rollName = "Unknown",
    item,
    sheetActor,
    attackType,
    sheetPowerRoll,
    targets,
    tnMod = 0,
    potencyMod = 0,
  }: ItemRollData = {}) {
    // If there's an item, get its actor; if there's no item, look for an actor
    // passed in from the sheet
    const actor = item?.parent ?? sheetActor;

    if (!actor) {
      const msg = game.i18n.localize("SMT.error.MissingItem");
      ui.notifications.error(msg);
      throw new TypeError(msg);
    }

    const itemData = item?.system;

    // General stuff
    // If there's an item, use its name and description
    // If it's a sheet roll, use the name
    const checkName = item?.name ?? rollName;
    const description = itemData?.description ?? "";
    const rolls: Roll[] = [];

    // Can we pay the item's cost?
    // If there's no item it's a sheet roll, which are free, so consider the cost paid
    const costType = itemData?.costType ?? "none";
    const costPaid = (await item?.payCost?.()) ?? true;

    // @ts-expect-error Awkward little typescript hack
    const attackItem = (item as AttackItem).system?.attackData as
      | AttackDataModel
      | undefined;

    const attackData = attackItem?._systemData;

    // If there's no attack data it's a sheet roll and not automatic
    const auto = attackData ? attackData.auto : false;
    const hasPowerRoll = attackData?.hasPowerRoll ?? sheetPowerRoll;
    // Leave affinity off if it's a sheet roll
    const affinity = attackData?.affinity;

    // TODO: Find a better way to handle this, like destructuring a single object
    const pinhole = attackData?.mods.pinhole;
    const pierce = attackData?.pierce;

    const context = {
      checkName,
      affinity,
      targets,
      description,
      costType,
      cost: itemData?.cost ?? 0,
      costPaid,
      auto,
      hasPowerRoll,
      // These get updated later if there's a success roll
      successLevel: costPaid ? "auto" : "fail",
      success: costPaid,
      fumble: false,
      criticalHit: false,
      canDodge: (attackData?.canDodge ?? false) || attackType,
      mods: {
        pinhole,
        pierce,
      },
    };

    if ((!auto && costPaid) || attackType) {
      // If it's a sheet roll, use the actor's base TN
      const baseTn = attackType
        ? actor.system.tn[attackType]
        : (attackData?.tn ?? 1);
      const tn = Math.max(baseTn + tnMod, 1);
      const critBoost =
        attackData?.critBoost ??
        (attackType !== "mag" && actor.system.mods.might);
      const autoFailThreshold =
        attackData?.autoFailThreshold ?? CONFIG.SMT.defaultAutofailThreshold;
      const cursed = actor?.statuses.has("curse");

      const {
        successLevel,
        criticalHit,
        fumble,
        roll,
        curseRoll,
        curseResult,
      } = await this.hitCheck({
        tn,
        critBoost,
        autoFailThreshold,
        cursed,
      });

      rolls.push(roll);

      if (curseRoll) {
        rolls.push(curseRoll);
        foundry.utils.mergeObject(context, {
          curseRoll: await curseRoll.render(),
          curseResult,
        });
      }

      foundry.utils.mergeObject(context, {
        tn,
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
      const boostAffinity = affinity as keyof typeof actor.system.elementBoost;
      const elementBoost = actor.system.elementBoost?.[boostAffinity];

      const damageType =
        attackData?.damageType ?? (attackType !== "mag" ? "phys" : "mag");
      const boostMultiplier = elementBoost ? 2 : 1;
      const basePower =
        (attackData?.basePower ??
          (attackType ? actor.system.power[attackType] : 0)) * boostMultiplier;
      const potency = attackData?.potency ?? 0;
      const powerBoost =
        attackData?.powerBoost ??
        (attackType
          ? actor.system.powerBoost[attackType === "gun" ? "phys" : "mag"]
          : false);

      const { power, critPower, roll } = await this.powerRoll({
        basePower,
        potency,
        potencyMod,
        powerBoost,
      });

      const damageTargets =
        targets && targets.length > 0
          ? targets.map((target) => {
              const resist = target.resist[damageType];
              const fly = target.fly;
              const flyMultiplier = fly ? 2 : 1;
              const critDamage = critPower * flyMultiplier;
              const damage = Math.max(power - resist, 0) * flyMultiplier;

              return { ...target, critDamage, damage, fly };
            })
          : targets;

      rolls.push(roll);

      foundry.utils.mergeObject(context, {
        damageType,
        targets: damageTargets,
        potency: potency + potencyMod,
        power,
        critPower,
        powerRoll: await roll.render(),
      });
    }

    // Add ailment info, if applicable
    if ((success || fumble) && attackData?.ailment.id) {
      const ailment = attackData.ailment;

      const ailmentCritRate = Math.clamp(ailment.rate * 2, 5, 95);

      foundry.utils.mergeObject(context, {
        ailment,
        ailmentCritRate,
      });
    }

    return await renderItemAttackCard({
      context,
      rolls,
      actor,
      token: actor.token,
    });
  }
}
