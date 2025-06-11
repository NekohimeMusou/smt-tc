import SmtToken from "../../documents/token.js";

export async function healingFountain() {
  const tokens = canvas.tokens.controlled as SmtToken[];

  for (const token of tokens) {
    await token.actor.healingFountain();
  }
}
