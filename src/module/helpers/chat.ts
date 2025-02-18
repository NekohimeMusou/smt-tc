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
    const msg = game.i18n.localize("SMT.error.missingHitCardRoll");
    throw new TypeError(msg);
  }

  const context = {
    checkName,
    tn,
    successLevel,
    rollContent: await roll.render(),
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
