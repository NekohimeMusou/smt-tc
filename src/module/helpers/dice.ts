import { SmtActor } from "../documents/actor/actor.js";

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

interface StatRollData {
  actor?: SmtActor;
  tnType?: TargetNumber;
  critBoost?: boolean;
}

export async function statRoll({
  actor,
  tnType,
  critBoost = false,
}: StatRollData = {}) {
  if (!actor) {
    const msg = game.i18n.localize("SMT.error.missingStatRollActor");
    throw new TypeError(msg);
  }

  if (!tnType) {
    const msg = game.i18n.localize("SMT.error.missingHitRollTN");
    throw new TypeError(msg);
  }

  const actorData = actor.system;

  const autoFailThreshold = actorData.autoFailThreshold;
  const tn = actor.system.tn[tnType];

  return await hitCheck({ tn, autoFailThreshold, critBoost });
}
