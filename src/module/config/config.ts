declare global {
  type CharacterClass = keyof typeof charClasses;
  type CharacterStat = keyof typeof stats;
  type ItemType = keyof typeof itemTypes;
}

// HBS partials
const templatePaths: string[] = [] as const;

// Character data
const charClasses = {
  human: "SMT.charClasses.human",
  fiend: "SMT.charClasses.fiend",
  demon: "SMT.charClasses.demon",
} as const;

const stats = {
  st: "SMT.stats.st",
  ma: "SMT.stats.ma",
  vi: "SMT.stats.vi",
  ag: "SMT.stats.ag",
  lu: "SMT.stats.lu",
} as const;

const fiendLevelTable = Array(101)
  .fill(0)
  .map((_, index) => Math.pow(index, 3));
const demonLevelTable = fiendLevelTable.map((xp) => Math.floor(xp * 1.3));
const humanLevelTable = fiendLevelTable.map((xp) => Math.floor(xp * 0.8));

const clans = {
  foul: "SMT.clans.foul",
  haunt: "SMT.clans.haunt",
  raptor: "SMT.clans.raptor",
  tyrant: "SMT.clans.tyrant",
  vile: "SMT.clans.vile",
  wilder: "SMT.clans.wilder",
  avatar: "SMT.clans.avatar",
  avian: "SMT.clans.avian",
  deity: "SMT.clans.deity",
  dragon: "SMT.clans.dragon",
  element: "SMT.clans.element",
  mitama: "SMT.clans.mitama",
  entity: "SMT.clans.entity",
  fury: "SMT.clans.fury",
  genma: "SMT.clans.genma",
  holy: "SMT.clans.holy",
  kishin: "SMT.clans.kishin",
  lady: "SMT.clans.lady",
  megami: "SMT.clans.megami",
  seraph: "SMT.clans.seraph",
  wargod: "SMT.clans.wargod",
  beast: "SMT.clans.beast",
  brute: "SMT.clans.brute",
  divine: "SMT.clans.divine",
  fairy: "SMT.clans.fairy",
  fallen: "SMT.clans.fallen",
  femme: "SMT.clans.femme",
  jirae: "SMT.clans.jirae",
  night: "SMT.clans.night",
  snake: "SMT.clans.snake",
  yoma: "SMT.clans.yoma",
  majin: "SMT.clans.majin",
  meta: "SMT.clans.meta",
} as const;

const inheritTraits = {
  mouth: "SMT.inheritTraits.mouth",
  eye: "SMT.inheritTraits.eye",
  lunge: "SMT.inheritTraits.lunge",
  weapon: "SMT.inheritTraits.weapon",
  claw: "SMT.inheritTraits.claw",
  teeth: "SMT.inheritTraits.teeth",
  wing: "SMT.inheritTraits.wing",
} as const;

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
  // item: "SMT.itemTypes.item",
  // weapon: "SMT.itemTypes.weapon",
  // gun: "SMT.itemTypes.gun",
  armor: "SMT.itemTypes.armor",
  magatama: "SMT.itemTypes.magatama",
  // demonCard: "SMT.itemTypes.card",
  // skill: "SMT.itemTypes.skill",
} as const;

const equipSlots = {
  head: "SMT.equipSlots.head",
  torso: "SMT.equipSlots.torso",
  legs: "SMT.equipSlots.legs",
  weapon: "SMT.equipSlots.weapon",
  gun: "SMT.equipSlots.gun",
  magatama: "SMT.equipSlots.magatama",
} as const;

export const SMT = {
  templatePaths,
  charClasses,
  stats,
  levelTables: {
    fiend: fiendLevelTable,
    demon: demonLevelTable,
    human: humanLevelTable,
  },
  clans,
  inheritTraits,
  affinityLevels,
  itemTypes,
  equipSlots,
} as const;
