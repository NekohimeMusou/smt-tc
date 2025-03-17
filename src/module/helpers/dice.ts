import AttackDataModel from "../data-models/embedded/attack.js";
import { CharacterAffinities } from "../data-models/embedded/defense-affinities.js";
import SmtActor from "../documents/actor/actor.js";
import { SmtItem } from "../documents/item/item.js";
import { renderItemAttackCard, renderAttackCard } from "./chat.js";

interface HitCheckData {
  tn?: number;
  autoFailThreshold?: number;
  critBoost?: boolean;
  cursed?: boolean;
}

interface HitCheckResult {
  successLevel: SuccessLevel;
  success: boolean;
  criticalHit: boolean;
  fumble: boolean;
  successRoll: Roll;
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
  powerRoll: Roll;
}

interface NewItemRollData {
  item?: SmtItem;
  targets?: TargetData[];
  tnMod?: number;
  potencyMod?: number;
}

interface TargetProcessData {
  target?: TargetData;
  damageType?: DamageType;
  attackAffinity?: Affinity;
  halfResist?: boolean;
  power?: number;
  critPower?: number;
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
    affinities: CharacterAffinities;
    damage?: number;
    critDamage?: number;
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

export default class SmtDice {
  static async hitCheck({
    tn = 1,
    autoFailThreshold = CONFIG.SMT.defaultAutofailThreshold,
    critBoost = false,
    cursed = false,
  }: HitCheckData = {}): Promise<HitCheckResult> {
    const critDivisor = critBoost ? 5 : 10;

    const critThreshold = Math.floor(tn / critDivisor);

    const successRoll = await new Roll("1d100").roll();
    const total = successRoll.total;

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
      success: successLevel === "success" || successLevel === "crit",
      criticalHit: successLevel === "crit",
      fumble: successLevel === "fumble",
      successRoll,
    };

    if (cursed) {
      const curseRoll = await new Roll("1d100").roll();
      foundry.utils.mergeObject(data, {
        curseRoll,
        curseResult: curseRoll.total <= 30,
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

    return { power, critPower: power * 2, powerRoll: roll };
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

      const { successLevel, successRoll, curseRoll, curseResult, fumble } =
        await this.hitCheck({
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
        successRollRender: await successRoll.render(),
      };

      foundry.utils.mergeObject(cardData, { successData });

      if (curseRoll) {
        rolls.push(curseRoll);
        foundry.utils.mergeObject(cardData, {
          successData: {
            curseRollRender: await curseRoll.render(),
            curseResult,
          },
        });
      }

      // Wait to do this until the end so we don't make a curse roll at the same time as we get cursed
      if (fumble) {
        await actor.toggleStatusEffect("curse", {
          active: true,
          overlay: false,
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

      const { power, critPower, powerRoll } = await this.powerRoll({
        basePower,
        potencyMod,
        powerBoost,
      });

      rolls.push(powerRoll);

      foundry.utils.mergeObject(cardData, {
        powerData: {
          power,
          critPower,
          powerRollRender: await powerRoll.render(),
        },
        successData: {
          success,
        },
      });
    }

    await renderAttackCard(cardData);
  }

  static async itemRoll({
    item,
    targets,
    tnMod = 0,
    potencyMod = 0,
  }: NewItemRollData = {}) {
    const actor = item?.parent;

    if (!item || !actor) {
      const msg = game.i18n.localize("SMT.error.missingActor");
      ui.notifications.error(msg);
      throw new TypeError(msg);
    }

    const itemData = item.system;

    // @ts-expect-error Awkward little TS hack
    const attackData = (item.system?.attackData as AttackDataModel | undefined)
      ?._systemData;

    const rolls: Roll[] = [];

    const costPaid = await item.payCost();

    // If it's not an attack item, we don't roll an attack
    const auto = attackData?.auto ?? true;
    const hasPowerRoll = attackData?.hasPowerRoll;

    let success = auto;
    let criticalHit = false;
    let fumble = false;

    const cardData = {
      actor,
      checkName: item.name,
      description: item.system.description,
      costType: itemData.costType,
      cost: itemData.cost,
      costPaid,
      auto,
      hasPowerRoll,
      mods: {
        pinhole: attackData?.mods.pinhole,
        pierce: attackData?.pierce,
      },
      rolls,
      targets,

      successLevel: costPaid ? "auto" : "fail",
      success: costPaid,
      criticalHit,
      fumble: false,
      canDodge: attackData?.canDodge,
    };

    if (attackData && !auto && costPaid) {
      const hitCheckResult = await this.hitCheck({
        tn: Math.max(attackData.tn + tnMod, 0),
        autoFailThreshold: attackData.autoFailThreshold,
        critBoost: attackData.critBoost,
        cursed: actor.statuses.has("curse"),
      });

      rolls.push(hitCheckResult.successRoll);

      success = hitCheckResult.success;
      criticalHit = hitCheckResult.criticalHit;
      fumble = hitCheckResult.fumble;

      const successData = {
        successLevel: hitCheckResult.successLevel,
        success,
        criticalHit,
        fumble,
        auto,
        tn: attackData.tn,
        autoFailThreshold: attackData.autoFailThreshold,
        successRollRender: await hitCheckResult.successRoll.render(),
      };

      if (hitCheckResult.curseRoll) {
        const curseRoll = hitCheckResult.curseRoll;
        rolls.push(curseRoll);
        foundry.utils.mergeObject(successData, {
          curseRollRender: curseRoll.render(),
          curseResult: hitCheckResult.curseResult,
        });
      }

      foundry.utils.mergeObject(cardData, successData);

      if (fumble) {
        await actor.toggleStatusEffect("curse", {
          active: true,
          overlay: false,
        });
      }
    }

    if ((success || fumble) && attackData?.hasPowerRoll) {
      const affinity = attackData.affinity;
      const elementBoost =
        actor.system.elementBoost?.[
          affinity as keyof typeof actor.system.elementBoost
        ];
      const boostMultiplier = elementBoost ? 2 : 1;

      const { power, critPower, powerRoll } = await this.powerRoll({
        basePower: attackData.basePower * boostMultiplier,
        potency: attackData.potency,
        potencyMod,
        powerBoost: attackData.powerBoost,
      });

      const focusMultiplier =
        actor.statuses.has("focus") && attackData.damageType === "phys" ? 2 : 1;

      rolls.push(powerRoll);

      const attackTargets = targets
        ? targets?.map((target) =>
            this.#processTarget({
              target,
              damageType: attackData.damageType,
              attackAffinity: attackData.affinity ?? "unique",
              halfResist: cardData.mods.pinhole,
              power: power * focusMultiplier,
              critPower: critPower * focusMultiplier,
            }),
          )
        : targets;

      foundry.utils.mergeObject(cardData, {
        damageType: attackData.damageType,
        targets: attackTargets,
        potency: attackData.potency + potencyMod,
        power: power * focusMultiplier,
        critPower: critPower * focusMultiplier,
        powerRollRender: await powerRoll.render(),
      });
    }

    if ((success || fumble) && attackData?.ailment.id) {
      const ailment = attackData.ailment;
      const ailmentCritRate = Math.clamp(ailment.rate * 2, 5, 95);

      foundry.utils.mergeObject(cardData, {
        ailment,
        ailmentCritRate,
      });
    }

    await actor.toggleStatusEffect("focus", { overlay: false, active: false });

    if (attackData?.autoFocus) {
      await actor.toggleStatusEffect("focus", { overlay: false, active: true });
    }

    return await renderItemAttackCard({
      context: cardData,
      rolls,
      actor,
      token: actor.token,
    });
  }

  static #processTarget({
    target,
    damageType = "phys",
    attackAffinity = "unique",
    halfResist = false,
    power = 0,
    critPower = 0,
  }: TargetProcessData = {}) {
    if (!target) {
      const msg = game.i18n.localize("SMT.error.missingTarget");
      ui.notifications.error(msg);
      throw new TypeError(msg);
    }

    const affinityLevel = target.affinities[attackAffinity];
    const isHealing = affinityLevel === "drain";
    const finalResist =
      attackAffinity === "healing"
        ? 0
        : Math.floor(target.resist[damageType] / (halfResist ? 2 : 1));
    let affinityMultiplier = 1;

    switch (affinityLevel) {
      case "strong":
        affinityMultiplier = 0.5;
        break;
      case "weak":
        affinityMultiplier = 2;
        break;
      case "null":
        affinityMultiplier = 0;
        break;
    }

    const fly = target.fly;
    const flyMultiplier = fly ? 2 : 1;

    const critDamage = Math.max(
      critPower * flyMultiplier * affinityMultiplier,
      0,
    );
    const damage = Math.floor(
      Math.max(affinityMultiplier * power - finalResist, 0) * flyMultiplier,
    );

    return {
      ...target,
      damage,
      isHealing,
      critDamage,
      affinityLevel,
      finalResist,
    };
  }
}
