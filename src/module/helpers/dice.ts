interface HitCheckData {
  tn?: number;
  autoFailThreshold?: number;
  critBoost?: boolean;
}

interface HitCheckResult {
  successLevel: SuccessLevel;
  roll: Roll;
}

export async function hitCheck({
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

interface PowerRollData {
  basePower?: number;
  powerBoost?: boolean;
}

interface PowerRollResult {
  power: number;
  roll: Roll;
}

export async function powerRoll({
  basePower = 0,
  powerBoost = false,
}: PowerRollData = {}): Promise<PowerRollResult> {
  const dice = powerBoost ? 2 : 1;
  const rollString = `${dice}d10x + ${basePower}`;

  const roll = await new Roll(rollString).roll();

  return { power: roll.total, roll };
}
