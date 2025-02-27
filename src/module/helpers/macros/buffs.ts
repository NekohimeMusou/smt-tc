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

  const { action, amount } = await renderBuffDialog();

  // If they cancelled, or entered 0 and didn't click one of the "clear"
  // buttons, don't do anything
  if (
    !action ||
    (!["dekaja", "dekunda", "clearAll"].includes(action) && !amount)
  ) {
    return;
  }

  const buffAmt = amount ?? 0;

  // Display full buff array in dialog and iterate through all the buffs each time; simplifies logic
}
