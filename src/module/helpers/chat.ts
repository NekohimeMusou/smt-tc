import { SmtActor } from "../documents/actor/actor.js";
import { SmtTokenDocument } from "../documents/token.js";

interface HitCheckCardData {
  actor?: SmtActor;
  token?: SmtTokenDocument;
  checkName?: string;
  tn?: number;
  successLevel?: SuccessLevel;
  roll?: Roll;
}

export async function showHitCheckCard({
  actor,
  token,
  checkName = "Mystery Check",
  tn = 1,
  successLevel = "autofail",
  roll,
}: HitCheckCardData = {}) {
  if (!roll) {
    const msg = game.i18n.format("SMT.error.missingCardRoll", {
      function: "showHitCheckCard",
    });
    ui.notifications.error(msg);
    throw new TypeError(msg);
  }

  const context = {
    checkName,
    tn,
    successLevel,
    roll: await roll.render(),
  };
  const template = "systems/smt-tc/templates/chat/hit-check-card.hbs";

  const content = await renderTemplate(template, context);

  const chatData = {
    user: game.user.id,
    content,
    speaker: {
      scene: game.scenes.current,
      actor,
      token,
    },
    rolls: [roll],
  };

  return await ChatMessage.create(chatData);
}

interface PowerRollCardData {
  actor?: SmtActor;
  token?: SmtTokenDocument;
  power?: number;
  name?: string;
  roll?: Roll;
}

export async function showPowerRollCard({
  actor,
  token,
  power = 0,
  name = "Power",
  roll,
}: PowerRollCardData = {}) {
  if (!roll) {
    const msg = game.i18n.format("SMT.error.missingCardRoll", {
      function: "showPowerRollCard",
    });
    ui.notifications.error(msg);
    throw new TypeError(msg);
  }

  const context = {
    name,
    power,
    roll: await roll.render(),
  };

  const template = "systems/smt-tc/templates/chat/power-roll-card.hbs";

  const content = await renderTemplate(template, context);

  const chatData = {
    user: game.user.id,
    content,
    speaker: {
      scene: game.scenes.current,
      actor,
      token,
    },
    rolls: [roll],
  };

  return await ChatMessage.create(chatData);
}

interface AttackRollCardData {
  actor?: SmtActor;
  token?: SmtTokenDocument;
  attackName?: string;
  tn?: number;
  successLevel?: SuccessLevel;
  hitRoll?: Roll;
  powerRoll?: Roll;
  power?: number;
}

export async function showAttackRollCard({
  actor,
  token,
  attackName,
  tn,
  successLevel,
  hitRoll,
  powerRoll,
  power,
}: AttackRollCardData = {}) {
  if (!hitRoll) {
    const msg = game.i18n.format("SMT.error.missingCardRoll", {
      function: "showAttackRollCard",
    });
    ui.notifications.error(msg);
    throw new TypeError(msg);
  }

  const context = {
    attackName,
    tn,
    successLevel,
    hitRoll: await hitRoll.render(),
    powerRoll: (await powerRoll?.render()) ?? null,
    power,
  };

  const rolls = [hitRoll];

  if (powerRoll) {
    rolls.push(powerRoll);
  }

  const template = "systems/smt-tc/templates/chat/attack-roll-card.hbs";
  const content = await renderTemplate(template, context);

  const chatData = {
    user: game.user.id,
    content,
    speaker: {
      scene: game.scenes.current,
      actor,
      token,
    },
    rolls,
  };

  return await ChatMessage.create(chatData);
}