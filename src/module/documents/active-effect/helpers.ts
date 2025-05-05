import SmtActor from "../actor/actor.js";
import { SmtItem } from "../item/item.js";
import SmtActiveEffect from "./active-effect.js";

interface AECategory {
  type: "temporary" | "passive" | "inactive";
  label: string;
  effects: SmtActiveEffect[];
}

interface AECategories {
  temporary: AECategory;
  passive: AECategory;
  inactive: AECategory;
}

type SystemAffinityPath = `system.affinities.${DefenseAffinity}`;

/**
 * Manage Active Effect instances through the Actor Sheet via effect control buttons.
 * @param {MouseEvent} event      The left-click event on the effect control
 * @param {Actor|Item} owner      The owning document which manages this effect
 */

export async function onManageActiveEffect(
  event: JQuery.ClickEvent,
  owner: SmtActor | SmtItem,
) {
  event.preventDefault();
  const a = $(event.currentTarget);
  const li = a.closest("li");

  const effect = li.data("effectId")
    ? owner.effects.get(li.data("effectId") as string)
    : null;

  const actor = ["fiend", "human", "demon"].includes(owner.type)
    ? owner
    : owner.parent!;

  switch (a.data("action")) {
    case "create":
      return await owner.createEmbeddedDocuments("ActiveEffect", [
        {
          name: game.i18n.localize("SMT.effects.newEffect"),
          icon: "icons/svg/aura.svg",
          origin: owner.uuid,
          duration: {
            rounds: li.data("effectType") === "temporary" ? 1 : undefined,
          },
          disabled: li.data("effectType") === "inactive",
        },
      ]);
    case "edit":
      return await effect?.sheet.render(true);
    case "delete":
      await owner.deleteEmbeddedDocuments("ActiveEffect", [effect?.id]);
      if (actor) await actor.sheet.render(false);
      return;
    case "toggle":
      await owner.updateEmbeddedDocuments("ActiveEffect", [
        { _id: effect?.id, disabled: !effect?.disabled },
      ]);
      if (actor) await actor.sheet.render(false);
      return;
  }
} /**
 * Prepare the data structure for Active Effects which are currently applied to an Actor or Item.
 * @param {ActiveEffect[]} effects    The array of Active Effect instances to prepare sheet data for
 * @return {object}                   Data for rendering
 */

export function prepareActiveEffectCategories(
  effects: Collection<SmtActiveEffect>,
): object {
  // Define effect header categories
  const categories: AECategories = {
    temporary: {
      type: "temporary",
      label: game.i18n.localize("SMT.effects.temporary"),
      effects: [],
    },
    passive: {
      type: "passive",
      label: game.i18n.localize("SMT.effects.passive"),
      effects: [],
    },
    inactive: {
      type: "inactive",
      label: game.i18n.localize("SMT.effects.inactive"),
      effects: [],
    },
  };

  // Iterate over active effects, classifying them into categories
  for (const e of effects) {
    if (e.disabled) categories.inactive.effects.push(e);
    else if (e.isTemporary) categories.temporary.effects.push(e);
    else categories.passive.effects.push(e);
  }
  return categories;
}

function isSystemAffinityPath(path: string): path is SystemAffinityPath {
  const affinity = path.split(".")?.[2];

  return (
    path.startsWith("system.affinities.") &&
    Object.keys(CONFIG.SMT.defenseAffinities).includes(affinity)
  );
}

function isAffinityLevel(level: string): level is AffinityLevel {
  // @ts-expect-error ???
  return CONFIG.SMT.affinityPriorities.includes(level);
}

// TODO: Blows up here with `string "none" is not a function`
export function applyAffinityOverride(
  document: Actor,
  change: AEChange,
  current: string,
  delta: string,
  changes: Record<string, unknown>,
) {
  const changeKey = change.key;

  if (
    // Return if the change key isn't a valid affinity path
    !isSystemAffinityPath(changeKey) ||
    // Return if the document isn't an SmtActor
    !(document instanceof SmtActor) ||
    // Return if the current value isn't a valid affinity level
    !isAffinityLevel(current) ||
    // Make sure delta is a valid change
    !isAffinityLevel(delta)
  ) {
    return;
  }

  // Find which affinity is "better"
  // @ts-expect-error ???
  const currentPriority = CONFIG.SMT.affinityPriorities.findIndex(current);
  // @ts-expect-error ???
  const deltaPriority = CONFIG.SMT.affinityPriorities.findIndex(delta);

  // If the incoming affinity has a higher precedence, add it to the change object
  if (deltaPriority > currentPriority) {
    changes[changeKey] = delta;
  }
}