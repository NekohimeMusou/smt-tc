import SmtToken from "../../documents/token.js";
import { renderBuffDialog } from "../dialog.js";

export type BuffAction =
  | keyof typeof CONFIG.SMT.buffs
  | "dekaja"
  | "dekunda"
  | "clearAll";

export async function applyBuffs() {
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

  const { action, amount, cancelled } = await renderBuffDialog();

  // If they cancelled, or entered 0 and didn't click one of the "clear"
  // buttons, don't do anything
  if (cancelled || !action) {
    return;
  }

  const buffAmt = amount ?? 0;

  const clearBuffs = action === "clearAll" || action === "dekaja";
  const clearDebuffs = action === "clearAll" || action === "dekunda";
  const applyBuffs = !clearBuffs && !clearDebuffs;

  if (clearBuffs) {
    await Promise.all(
      tokens.map(async (token) => {
        const updates = Object.fromEntries(
          Object.keys(CONFIG.SMT.buffSpells).map((buff) => [
            `system.buffs.${buff}`,
            0,
          ]),
        );
        await token.actor.update(updates);
      }),
    );
  }

  if (clearDebuffs) {
    await Promise.all(
      tokens.map(async (token) => {
        const updates = Object.fromEntries(
          Object.keys(CONFIG.SMT.debuffSpells).map((debuff) => [
            `system.buffs.${debuff}`,
            0,
          ]),
        );
        await token.actor.update(updates);
      }),
    );
  }

  if (applyBuffs) {
    await Promise.all(
      tokens.map(async (token) => {
        const originalValue = token.actor.system.buffs[action];
        const updates = Object.fromEntries([
          [`system.buffs.${action}`, originalValue + buffAmt],
        ]);
        await token.actor.update(updates);
      }),
    );
  }

  const targetNames = tokens.map((token) => token.name);

  // Are we clearing buffs (i.e. should we suppress the stat increase/reduce msg?)
  const cancelBuffs = ["dekunda", "dekaja", "clearAll"].includes(action);
  const isDebuff = ["tarunda", "rakunda", "sukunda"].includes(action);
  const direction = isDebuff ? "reduced" : "increased";

  const context = {
    action,
    targetNames,
    cancelBuffs,
    direction,
    buffAmt,
  };

  const template = "systems/smt-tc/templates/chat/macro/buff-result.hbs";

  const content = await renderTemplate(template, context);

  const chatData = {
    author: game.user.id,
    content,
    speaker: {
      scene: game.scenes.current,
      alias: game.i18n.localize("SMT.macro.kagutsuchi"),
    },
  };

  return await ChatMessage.create(chatData);
}
