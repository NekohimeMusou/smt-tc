import SmtToken from "../../documents/token.js";
import { renderAwardDialog } from "../dialog.js";

type LuckyFindSuccess = "success" | "fail" | "crit";

interface LuckyFindResult {
  name: string;
  successLevel: LuckyFindSuccess;
  luckTN: number;
  roll: Roll;
  rollRender: string;
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

  const dropList = tokens
    .filter((token) => token.actor.system.awards.itemDrops)
    .map((token) => token.actor.system.awards.itemDrops);

  const itemDrops: { item: string; qty: number }[] = [];

  for (const item of dropList) {
    // Try to find the item in the list of drops
    const dropEntry = itemDrops.find((drop) => drop.item === item);

    // If it isn't there, add it
    if (!dropEntry) {
      itemDrops.push({ item, qty: 1 });
    } else {
      dropEntry.qty += 1;
    }
  }

  const template =
    "systems/smt-tc/templates/chat/macro/conflict-resolution.hbs";
  const content = await renderTemplate(template, { xp, macca, itemDrops });

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

export async function grantRewards() {
  // GMs only!
  if (!game.user.isGM) {
    return ui.notifications.notify(game.i18n.localize("SMT.ui.gmOnly"));
  }

  const tokens = canvas.tokens.controlled as SmtToken[];

  const selectedTokens = tokens.length;

  // If no tokens are controlled, display a notification
  if (selectedTokens < 1) {
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
  const totalMacca = maccaEarned ?? 0;

  const macca = Math.floor(totalMacca / selectedTokens);

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
      alias: game.i18n.localize("SMT.macro.kagutsuchi"),
    },
  };

  await ChatMessage.create(chatData);

  // Do Lucky Find checks
  await luckyFindCheck(tokens);
}

async function luckyFindCheck(tokens: SmtToken[]) {
  // GMs only!
  if (!game.user.isGM) {
    return ui.notifications.notify(game.i18n.localize("SMT.ui.gmOnly"));
  }

  const results = await Promise.all(
    tokens
      .filter((token) => token.actor.system.mods.luckyFind)
      .map(async (token) => await luckyFindRoll(token)),
  );

  // Show total hits, total crits
  const successes = results.reduce(
    (total, curr) => total + (curr.successLevel === "success" ? 1 : 0),
    0,
  );

  const crits = results.reduce(
    (total, curr) => total + (curr.successLevel === "crit" ? 1 : 0),
    0,
  );

  const rolls = results.map((result) => result.roll);

  const context = {
    results,
    successes,
    crits,
  };

  const template = "systems/smt-tc/templates/chat/macro/lucky-find.hbs";

  const content = await renderTemplate(template, context);

  const chatData = {
    author: game.user.id,
    content,
    speaker: {
      scene: game.scenes.current,
      alias: game.i18n.localize("SMT.macro.kagutsuchi"),
    },
    rolls,
  };

  return await ChatMessage.create(chatData);
}

async function luckyFindRoll(token: SmtToken): Promise<LuckyFindResult> {
  const name = token.name;
  const autoFailThreshold = token.actor.system.autoFailThreshold;
  const luckTN = token.actor.system.tn.lu;
  const critThreshold = Math.floor(luckTN / 10);

  const roll = await new Roll("1d100").roll();
  const total = roll.total;

  let successLevel: LuckyFindSuccess = "fail";

  if (total <= critThreshold && total < autoFailThreshold) {
    successLevel = "crit";
  } else if (total <= luckTN && total < autoFailThreshold) {
    successLevel = "success";
  }

  return { name, successLevel, luckTN, roll, rollRender: await roll.render() };
}
