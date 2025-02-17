declare global {
  type CharacterClass = keyof typeof characterClasses;
  type ItemType = keyof typeof itemTypes;
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
  "systems/smt-tc/templates/parts/actor/magatama-list.hbs",
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

const affinityLevels = {
  none: "SMT.affinityLevels.none",
  weak: "SMT.affinityLevels.weak",
  strong: "SMT.affinityLevels.strong",
  null: "SMT.affinityLevels.null",
  drain: "SMT.affinityLevels.drain",
  repel: "SMT.affinityLevels.repel",
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

export const SMT = {
  templatePaths,
  characterClasses,
  levelTables: {
    fiend: fiendLevelTable,
    demon: demonLevelTable,
    human: humanLevelTable,
  },
  affinityLevels,
  itemTypes,
  equipSlots,
} as const;
