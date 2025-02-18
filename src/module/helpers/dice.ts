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
}: HitCheckData = {}): HitCheckResult {
  const critDivisor = critBoost ? 5 : 10;

  const critThreshold = Math.floor(tn / critDivisor);

  const roll = await new Roll("1d100").roll();
  const total = roll.total;
}
