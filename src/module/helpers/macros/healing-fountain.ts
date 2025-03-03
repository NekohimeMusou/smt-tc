import SmtToken from "../../documents/token.js";

export async function healingFountain() {
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

  const results = await Promise.all(
    tokens.map(async (token) => await token.actor.applyHealingFountain()),
  );

  const template = "systems/smt-tc/templates/chat/macro/healing-fountain.hbs";

  const content = await renderTemplate(template, { results });

  const chatData = {
    author: game.user.id,
    content,
    speaker: {
      scene: game.scenes.current,
      alias: game.i18n.localize("SMT.macro.fountain.ladyOfTheFount"),
    },
  };

  return await ChatMessage.create(chatData);
}
