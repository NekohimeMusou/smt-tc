declare global {
  type CharacterClass = keyof typeof characterClasses;
  type ItemType = keyof typeof itemTypes;
}

const templatePaths: string[] = [] as const;

const characterClasses = {
  fiend: "SMT.charClasses.fiend",
  demon: "SMT.charClasses.demon",
  human: "SMT.charClasses.human",
} as const;

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
} as const;

const equipSlots = {
  none: "SMT.equipSlots.none",
  magatama: "SMT.equipSlots.magatama",
  gun: "SMT.equipSlots.gun",
  melee: "SMT.equipSlots.melee",
  head: "SMT.equipSlots.head",
  torso: "SMT.equipSlots.torso",
  legs: "SMT.equipSlots.legs",
};

export const SMT = {
  templatePaths,
  characterClasses,
  affinityLevels,
  itemTypes,
  equipSlots,
} as const;
