import SmtActor from "../documents/actor/actor.js";
import SmtTokenDocument from "../documents/token-document.js";

interface ItemAttackCardData {
  context: object;
  rolls: Roll[];
  actor?: SmtActor;
  token?: SmtTokenDocument;
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

  // Attach event handler to ".card-ailment-roll"
  // data-ailment-rate, data-ailment-id

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

interface ItemCardReactionData {
  ailmentId?: AilmentId;
  ailmentRate?: number;
  isDodge?: boolean;
}

function _onCardRoll(event: JQuery.ClickEvent) {
  event.preventDefault();

  // @ts-expect-error isOwner exists on tokens too
  const tokens = canvas.tokens.controlled.filter((token) => token.isOwner);

  const element = $(event.currentTarget);
  const { ailmentId, ailmentRate, isDodge }: ItemCardReactionData =
    element.data();

  // Allow a popup dialog to modify rolls
  // Extra/house ailment mods, dodge TN mods
}