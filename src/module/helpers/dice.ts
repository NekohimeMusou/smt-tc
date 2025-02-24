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
  powerBoost?: boolean;
  criticalHit?: boolean;
}

interface PowerRollResult {
  power: number;
  roll: Roll;
}

export class SmtDice {
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
    powerBoost = false,
    criticalHit = false,
  }: PowerRollData = {}): Promise<PowerRollResult> {
    const dice = powerBoost ? 2 : 1;
    const rollString = criticalHit
      ? `(${dice}d10x + ${basePower} + ${potency}) * 2`
      : `${dice}d10x + ${basePower} + ${potency}`;

    const roll = await new Roll(rollString).roll();

    return { power: roll.total, roll };
  }
}
