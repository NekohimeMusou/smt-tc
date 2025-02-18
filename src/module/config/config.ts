declare global {
  type CharacterClass = keyof typeof characterClasses;
  type ItemType = keyof typeof itemTypes;
  type SuccessLevel = keyof typeof successLevels;
  type TargetNumber = keyof typeof tn;
}

const templatePaths: string[] = [
  // Temporary(?) actor sheet template
  "systems/smt-tc/templates/actor/actor-sheet.hbs",

  // Actor sheet tabs
  "systems/smt-tc/templates/parts/actor/tabs/main.hbs",
  "systems/smt-tc/templates/parts/actor/tabs/inventory.hbs",
  "systems/smt-tc/templates/parts/actor/tabs/bio.hbs",
  "systems/smt-tc/templates/parts/actor/tabs/magatama.hbs",

  // Actor sheet panes
  "systems/smt-tc/templates/parts/actor/header.hbs",
  "systems/smt-tc/templates/parts/actor/resources.hbs",

  // Main tab
  "systems/smt-tc/templates/parts/actor/stats.hbs",
  "systems/smt-tc/templates/parts/actor/derived-stats.hbs",
  "systems/smt-tc/templates/parts/actor/mods.hbs",
  "systems/smt-tc/templates/parts/actor/buffs.hbs",

  // Bio data
  "systems/smt-tc/templates/parts/actor/alignment.hbs",
  "systems/smt-tc/templates/parts/actor/awards.hbs",

  // Inventory
  "systems/smt-tc/templates/parts/actor/magatama-list.hbs",

  "systems/smt-tc/templates/parts/shared/affinities.hbs",
] as const;

const characterClasses = {
  fiend: "SMT.charClasses.fiend",
  // demon: "SMT.charClasses.demon",
  // human: "SMT.charClasses.human",
} as const;

const fiendLevelTable = Array(101)
  .fill(0)
  .map((_, index) => Math.pow(index, 3));
const demonLevelTable = fiendLevelTable.map((xp) => Math.floor(xp * 1.3));
const humanLevelTable = fiendLevelTable.map((xp) => Math.floor(xp * 0.8));

const defenseAffinities = {
  phys: "SMT.affinities.phys",
  fire: "SMT.affinities.fire",
  cold: "SMT.affinities.cold",
  elec: "SMT.affinities.elec",
  force: "SMT.affinities.force",
  light: "SMT.affinities.light",
  dark: "SMT.affinities.dark",
  ruin: "SMT.affinities.ruin",
  nerve: "SMT.affinities.nerve",
  mind: "SMT.affinities.mind",
  ailment: "SMT.affinities.ailment",
} as const;

const affinityLevels = {
  none: "SMT.affinityLevels.none",
  weak: "SMT.affinityLevels.weak",
  strong: "SMT.affinityLevels.strong",
  null: "SMT.affinityLevels.null",
  drain: "SMT.affinityLevels.drain",
  repel: "SMT.affinityLevels.repel",
} as const;

const tn = {
  st: "SMT.tn.st",
  ma: "SMT.tn.ma",
  vi: "SMT.tn.vi",
  ag: "SMT.tn.ag",
  lu: "SMT.tn.lu",
  physAtk: "SMT.tn.physAtk",
  magAtk: "SMT.tn.magAtk",
  save: "SMT.tn.save",
  dodge: "SMT.tn.dodge",
  negotiation: "SMT.tn.negotiation",
};

const alignment = {
  law: "SMT.alignment.law",
  chaos: "SMT.alignment.chaos",
  dark: "SMT.alignment.dark",
  light: "SMT.alignment.light",
  neutral: "SMT.alignment.neutral",
  heeHo: "SMT.alignment.heeHo",
} as const;

const itemTypes = {
  magatama: "SMT.itemTypes.magatama",
  // weapon: "SMT.itemTypes.weapon",
  // armor: "SMT.itemTypes.armor",
  // consumable: "SMT.itemTypes.consumable",
  // skill: "SMT.itemTypes.skill",
} as const;

const equipSlots = {
  none: "SMT.equipSlots.none",
  magatama: "SMT.equipSlots.magatama",
  gun: "SMT.equipSlots.gun",
  melee: "SMT.equipSlots.melee",
  head: "SMT.equipSlots.head",
  torso: "SMT.equipSlots.torso",
  legs: "SMT.equipSlots.legs",
} as const;

const successLevels = {
  fail: "SMT.successLevel.fail",
  success: "SMT.successLevel.success",
  crit: "SMT.successLevel.crit",
  autofail: "SMT.successLevel.autofail",
  fumble: "SMT.successLevel.fumble",
};

const defaultAutofailThreshold = 96;

export const SMT = {
  templatePaths,
  characterClasses,
  levelTables: {
    fiend: fiendLevelTable,
    demon: demonLevelTable,
    human: humanLevelTable,
  },
  defenseAffinities,
  affinityLevels,
  tn,
  alignment,
  itemTypes,
  equipSlots,
  successLevels,
  defaultAutofailThreshold,
} as const;
