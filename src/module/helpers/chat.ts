import SmtActor from "../documents/actor/actor.js";
import SmtToken from "../documents/token.js";
import { showAttackModifierDialog } from "./dialog.js";
import SmtDice from "./dice.js";

interface ItemAttackCardData {
  context: object;
  rolls: Roll[];
  actor?: SmtActor;
  token?: SmtToken;
}

interface AilmentCardData {
  id: AilmentId;
  rate: number;
  critRate?: number;
}

interface SuccessCardData {
  successLevel?: SuccessLevel;
  success?: boolean;
  auto?: boolean;
  tn?: number;
  autoFailThreshold?: number;
  successRollRender?: string;
  curseRollRender?: string;
  curseResult?: boolean;
}

interface PowerCardData {
  power?: number;
  critPower?: number;
  powerRollRender?: string;
}

interface RollCardData {
  actor?: SmtActor;
  checkName?: string;
  affinity?: Affinity;
  costType?: CostType;
  cost?: number;
  description?: string;
  costPaid?: boolean;
  successData?: SuccessCardData;
  powerData?: PowerCardData;
  ailmentData?: AilmentCardData;
  mods?: object;
  rolls?: Roll[];
  targets?: TargetData[];
}

interface CardRollTokenData {
  token?: SmtToken;
  reactionTag?: ReactionTag;
  ailmentRate?: number;
  tnMod?: number;
}

export async function renderItemAttackCard(
  { context, rolls, actor, token }: ItemAttackCardData = {
    context: {},
    rolls: [],
  },
) {
  const template = "systems/smt-tc/templates/chat/sheet-roll-card.hbs";
  const content = await renderTemplate(template, context);

  const chatData = {
    author: game.user.id,
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

// eslint-disable-next-line @typescript-eslint/require-await
Hooks.on("renderChatMessage", async (message: ChatMessage, html: JQuery) => {
  if ((message.author ?? message.user) == game.user) {
    html.find(".card-reaction-roll").on("click", _onCardRoll);
  }
});

export async function renderAttackCard({
  actor,
  checkName = "Unknown",
  affinity,
  costType = "none",
  cost,
  description = "",
  costPaid = true,
  successData = {},
  powerData = {},
  ailmentData,
  rolls,
  targets,
}: RollCardData = {}) {
  const context = {
    checkName,
    affinity,
    costType,
    cost,
    description,
    costPaid,
    ...successData,
    ...powerData,
    ailmentData,
    rolls,
    targets,
    criticalHit: successData?.successLevel === "crit",
    fumble: successData?.successLevel === "fumble",
  };

  const template = "systems/smt-tc/templates/chat/sheet-roll-card.hbs";
  const content = await renderTemplate(template, context);

  const chatData = {
    author: game.user.id,
    content,
    speaker: {
      scene: game.scenes.current,
      actor,
      token: actor?.token,
    },
    rolls,
  };

  return await ChatMessage.create(chatData);
}

type ReactionTag = AilmentId | "dodge";
interface ItemCardReactionData {
  reactionTag?: ReactionTag;
  ailmentRate?: number;
}

// TODO: Also limit this to only tokens that were targeted?
async function _onCardRoll(event: JQuery.ClickEvent) {
  event.preventDefault();

  const tokens = canvas.tokens.controlled.filter(
    // @ts-expect-error isOwner exists on tokens too
    (token) => token.isOwner,
  ) as SmtToken[];

  const element = $(event.currentTarget);
  const { reactionTag, ailmentRate }: ItemCardReactionData = element.data();

  // Allow a popup dialog to modify rolls BEFORE processing tokens
  const showDialog =
    event.shiftKey != game.settings.get("smt-tc", "showRollDialogByDefault");

  const { tnMod, cancelled } = showDialog
    ? await showAttackModifierDialog("Bill")
    : { tnMod: 0, cancelled: false };

  if (cancelled) {
    return;
  }

  // Process each token
  return await Promise.all(
    tokens.map(async (token) =>
      _processCardRollToken({
        token,
        reactionTag,
        ailmentRate,
        tnMod,
      }),
    ),
  );
}

async function _processCardRollToken({
  token,
  reactionTag,
  ailmentRate = 0,
  tnMod = 0,
}: CardRollTokenData = {}) {
  if (!token) {
    const msg = game.i18n.localize("SMT.error.missingToken");
    ui.notifications.error(msg);
    throw new Error(msg);
  }

  if (!reactionTag) {
    const msg = game.i18n.localize("SMT.error.missingReactionTag");
    ui.notifications.error(msg);
    throw new Error(msg);
  }

  console.log(token);

  if (reactionTag === "dodge") {
    // Make a statRoll and pass in the TN mod and checkName and tnType "dodge"
    const checkName = game.i18n.localize("SMT.tn.dodge");
    return await SmtDice.statRoll({ actor: token.actor, tnType: "dodge", checkName, tnMod });
  } else {
    // Do an ailment roll
    const name = game.i18n.localize(`SMT.ailments.${reactionTag}`);
    const context = {
      ...(await SmtDice.ailmentRoll(Math.clamp(ailmentRate + tnMod, 5, 95))),
      rate: ailmentRate,
      name,
    };

    foundry.utils.mergeObject(context, {
      rollRender: await context.roll.render(),
    });

    const template = "systems/smt-tc/templates/chat/ailment-roll-card.hbs";
    const content = await renderTemplate(template, context);

    const chatData = {
      author: game.user.id,
      content,
      speaker: {
        scene: game.scenes.current,
        actor: token.actor,
        token: token.document,
      },
      rolls: [context.roll],
    };

    return await ChatMessage.create(chatData);
  }
}