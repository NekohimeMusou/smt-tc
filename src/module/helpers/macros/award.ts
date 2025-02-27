import { SmtToken } from "../../documents/token.js";
import { renderAwardDialog } from "../dialog.js";

export async function resolveConflict() {
  // GMs only!
  if (!game.user.isGM) {
    return ui.notifications.notify(game.i18n.localize("SMT.ui.gmOnly"));
  }

  const tokens = canvas.tokens.controlled as SmtToken[];

  // If no tokens are controlled, display a notification
  if (tokens.length < 1) {
    return ui.notifications.notify(
      game.i18n.localize("SMT.ui.noTokensSelected"),
    );
  }

  const xp = tokens.reduce(
    (total, token) => total + token.actor.system.awards.xp,
    0,
  );

  const macca = tokens.reduce(
    (total, token) => total + token.actor.system.awards.macca,
    0,
  );

  const itemDrops = tokens
    .filter((token) => token.actor.system.awards.itemDrops)
    .map((token) => token.actor.system.awards.itemDrops);

  const template =
    "systems/smt-tc/templates/chat/macro/conflict-resolution.hbs";
  const content = await renderTemplate(template, { xp, macca, itemDrops });

  const chatData = {
    author: game.user.id,
    content,
    speaker: {
      scene: game.scenes.current,
      alias: game.i18n.localize("SMT.kagutsuchi"),
    },
  };

  return await ChatMessage.create(chatData);
}

export async function grantRewards() {
  // GMs only!
  if (!game.user.isGM) {
    return ui.notifications.notify(game.i18n.localize("SMT.ui.gmOnly"));
  }

  const tokens = canvas.tokens.controlled as SmtToken[];

  // If no tokens are controlled, display a notification
  if (tokens.length < 1) {
    return ui.notifications.notify(
      game.i18n.localize("SMT.ui.noTokensSelected"),
    );
  }

  const {
    xp: xpEarned,
    macca: maccaEarned,
    cancelled,
  } = await renderAwardDialog();

  if (cancelled) {
    return;
  }

  const xp = xpEarned ?? 0;
  const macca = maccaEarned ?? 0;

  await Promise.all(
    tokens.map(
      async (token) =>
        await token.actor.update({
          "system.xp": token.actor.system.xp + xp,
          "system.macca": token.actor.system.macca + macca,
        }),
    ),
  );

  const recipientNames = tokens.map((token) => token.name);

  const template = "systems/smt-tc/templates/chat/macro/award-card.hbs";
  const content = await renderTemplate(template, { recipientNames, xp, macca });

  const chatData = {
    author: game.user.id,
    content,
    speaker: {
      scene: game.scenes.current,
      alias: game.i18n.localize("SMT.kagutsuchi"),
    },
  };

  return await ChatMessage.create(chatData);
}
