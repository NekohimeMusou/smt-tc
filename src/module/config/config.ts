declare global {
  type CharacterClass = keyof typeof charClasses;
}

// HBS partials
const templatePaths: string[] = [] as const;

// Character data
const charClasses = {
  human: "SMT.charClasses.human",
  fiend: "SMT.charClasses.fiend",
  demon: "SMT.charClasses.demon",
} as const;

const fiendLevelTable = Array(101)
  .fill(0)
  .map((_, index) => Math.pow(index, 3));
const demonLevelTable = fiendLevelTable.map((xp) => Math.floor(xp * 1.3));
const humanLevelTable = fiendLevelTable.map((xp) => Math.floor(xp * 0.8));

// Affinity data
const affinityLevels = {
  reflect: "SMT.affinityLevels.reflect",
  drain: "SMT.affinityLevels.drain",
  null: "SMT.affinityLevels.null",
  resist: "SMT.affinityLevels.resist",
  weak: "SMT.affinityLevels.weak",
  none: "SMT.affinityLevels.none",
} as const;

// Item data
const itemTypes = {
  item: "SMT.itemTypes.item",
  weapon: "SMT.itemTypes.weapon",
  gun: "SMT.itemTypes.gun",
  armor: "SMT.itemTypes.armor",
  magatama: "SMT.itemTypes.magatama",
  card: "SMT.itemTypes.card",
  skill: "SMT.itemTypes.skill",
} as const;

export const SMT = {
  templatePaths,
  charClasses,
  levelTables: {
    fiend: fiendLevelTable,
    demon: demonLevelTable,
    human: humanLevelTable,
  },
  affinityLevels,
  itemTypes,
} as const;
