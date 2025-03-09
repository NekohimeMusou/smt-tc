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
    potencyMod = 0,
    powerBoost = false,
    criticalHit = false,
  }: PowerRollData = {}): Promise<PowerRollResult> {
    const dice = powerBoost ? 2 : 1;
    const rollString = criticalHit
      ? `(${dice}d10x + ${basePower} + ${potencyMod}) * 2`
      : `${dice}d10x + ${basePower} + ${potencyMod}`;

    const roll = await new Roll(rollString).roll();

    return { power: roll.total, roll };
  }

  static async itemRoll({
    item,
    // tnMod = 0,
    // potencyMod = 0,
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
