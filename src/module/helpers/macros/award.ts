import { SmtToken } from "../../documents/token.js";

interface AwardHTMLElement extends HTMLElement {
  xp?: { value?: string };
  macca?: { value?: string };
}

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
    user: game.user.id,
    content,
    speaker: {
      scene: game.scenes.current,
      alias: game.i18n.localize("SMT.kagutsuchi"),
    },
  };

  return await ChatMessage.create(chatData);
}

interface AwardDialogResult {
  xp?: number;
  macca?: number;
  cancelled?: boolean;
}

async function renderAwardDialog(): Promise<AwardDialogResult> {
  const template = "systems/smt-tc/templates/dialog/award-dialog.hbs";
  const content = await renderTemplate(template, {});

  return new Promise((resolve) =>
    new Dialog(
      {
        title: game.i18n.localize("SMT.dialog.awardDialogTitle"),
        content,
        buttons: {
          ok: {
            label: "OK",
            callback: (html) =>
              resolve({
                xp:
                  parseInt(
                    ($(html)[0].querySelector("form") as AwardHTMLElement)?.xp
                      ?.value ?? "0",
                  ) || 0,
                macca:
                  parseInt(
                    ($(html)[0].querySelector("form") as AwardHTMLElement)
                      ?.macca?.value ?? "0",
                  ) || 0,
              }),
          },
          cancel: {
            label: "Cancel",
            callback: () => resolve({ cancelled: true }),
          },
        },
        default: "ok",
        close: () => resolve({ cancelled: true }),
      },
      {},
    ).render(true),
  );
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
    user: game.user.id,
    content,
    speaker: {
      scene: game.scenes.current,
      alias: game.i18n.localize("SMT.kagutsuchi"),
    },
  };

  return await ChatMessage.create(chatData);
}
