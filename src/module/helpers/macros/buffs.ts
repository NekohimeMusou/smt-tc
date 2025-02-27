import { SmtToken } from "../../documents/token.js";
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

  const updateArray: [string, number][] = [];

  // Can't push to array without this type declaration
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const dekajaUpdates = Object.keys(CONFIG.SMT.buffSpells).map((buff) => [
    `system.buffs.${buff}`,
    0,
  ]) as [string, number][];

  // Can't push to array without this type declaration
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  const dekundaUpdates = Object.keys(CONFIG.SMT.debuffSpells).map((debuff) => [
    `system.buffs.${debuff}`,
    0,
  ]) as [string, number][];

  switch (action) {
    case "clearAll":
      updateArray.push(...dekajaUpdates);
      updateArray.push(...dekundaUpdates);
      break;
    case "dekaja":
      updateArray.push(...dekajaUpdates);
      break;
    case "dekunda":
      updateArray.push(...dekundaUpdates);
      break;
    default:
      updateArray.push([`system.buffs.${action}`, buffAmt]);
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
    user: game.user.id,
    content,
    speaker: {
      scene: game.scenes.current,
      alias: game.i18n.localize("SMT.kagutsuchi"),
    },
  };

  return await ChatMessage.create(chatData);
}
