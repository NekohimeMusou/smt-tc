import { statusEffects } from "./statuses.js";

declare global {
  type CharacterClass = keyof typeof charClasses;
  type CharacterStat = keyof typeof stats;
  type TargetNumber = keyof typeof targetNumbers;
  type ItemType = keyof typeof itemTypes;
  type DamageType = keyof typeof damageTypes;
  type PowerBoostType = keyof typeof powerBoostTypes;
}

// HBS partials
const templatePaths: string[] = [
  // Temporary - Until I make unique sheets
  "systems/smt-tc/templates/actor/actor-sheet.hbs",
  "systems/smt-tc/templates/item/item-sheet.hbs",
  // Real partials
  "systems/smt-tc/templates/parts/actor/tabs/main.hbs",
  "systems/smt-tc/templates/parts/actor/tabs/bio.hbs",
  "systems/smt-tc/templates/parts/shared/effects.hbs",
  "systems/smt-tc/templates/parts/shared/affinities.hbs",
  "systems/smt-tc/templates/parts/actor/header.hbs",
  "systems/smt-tc/templates/parts/actor/resources.hbs",
  "systems/smt-tc/templates/parts/actor/stats.hbs",
  "systems/smt-tc/templates/parts/actor/alignment.hbs",
  "systems/smt-tc/templates/parts/actor/background.hbs",
  "systems/smt-tc/templates/parts/actor/enemy-data.hbs",
  "systems/smt-tc/templates/parts/actor/demon.hbs",
  "systems/smt-tc/templates/parts/item/tabs/main.hbs",
  "systems/smt-tc/templates/parts/item/header.hbs",
  "systems/smt-tc/templates/parts/item/armor.hbs",
  "systems/smt-tc/templates/parts/item/magatama.hbs",
  "systems/smt-tc/templates/parts/item/attack.hbs",
] as const;

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

const targetNumbers = {
  st: "SMT.stats.st",
  ma: "SMT.stats.ma",
  vi: "SMT.stats.vi",
  ag: "SMT.stats.ag",
  lu: "SMT.stats.lu",
  save: "SMT.stats.save",
  dodge: "SMT.stats.dodge",
  negotiation: "SMT.stats.negotiation",
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
const affinities = {
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
  almighty: "SMT.affinities.almighty",
  healing: "SMT.affinities.healing",
  unique: "SMT.affinities.unique",
  support: "SMT.affinities.support",
  ailment: "SMT.affinities.ailment",
  talk: "SMT.affinities.talk",
  none: "SMT.affinities.none",
} as const;

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
  repel: "SMT.affinityLevels.repel",
  drain: "SMT.affinityLevels.drain",
  null: "SMT.affinityLevels.null",
  strong: "SMT.affinityLevels.strong",
  weak: "SMT.affinityLevels.weak",
  none: "SMT.affinityLevels.none",
} as const;

// Ailment data
const ailments = {
  dead: "SMT.ailments.dead",
  stone: "SMT.ailments.stone",
  flied: "SMT.ailments.flied",
  stun: "SMT.ailments.stun",
  charm: "SMT.ailments.charm",
  poison: "SMT.ailments.poison",
  mute: "SMT.ailments.mute",
  restrain: "SMT.ailments.restrain",
  freeze: "SMT.ailments.freeze",
  sleep: "SMT.ailments.sleep",
  panic: "SMT.ailments.panic",
  shock: "SMT.ailments.shock",
  curse: "SMT.ailments.curse",
  instantKill: "SMT.ailments.instantKill",
} as const;

// Item data
// This is only used as a type (keyof typeof) atm
const itemTypes = {
  item: "SMT.itemTypes.item",
  melee: "SMT.itemTypes.weapon",
  gun: "SMT.itemTypes.gun",
  armor: "SMT.itemTypes.armor",
  magatama: "SMT.itemTypes.magatama",
  // demonCard: "SMT.itemTypes.card",
  skill: "SMT.itemTypes.skill",
} as const;

const equipSlots = {
  head: "SMT.equipSlots.head",
  torso: "SMT.equipSlots.torso",
  legs: "SMT.equipSlots.legs",
  melee: "SMT.equipSlots.melee",
  gun: "SMT.equipSlots.gun",
  magatama: "SMT.equipSlots.magatama",
} as const;

// Skill data
const skillTypes = {
  phys: "SMT.skillTypes.phys",
  mag: "SMT.skillTypes.mag",
  spell: "SMT.skillTypes.spell",
  passive: "SMT.skillTypes.passive",
  talk: "SMT.skillTypes.talk",
} as const;

const damageTypes = {
  phys: "SMT.damageTypes.phys",
  mag: "SMT.damageTypes.mag",
} as const;

const targets = {
  self: "SMT.targets.self",
  oneAlly: "SMT.targets.oneAlly",
  oneEnemy: "SMT.targets.oneEnemy",
  allAllies: "SMT.targets.allAllies",
  allEnemies: "SMT.targets.allEnemies",
  allCombatants: "SMT.targets.allCombatants",
} as const;

const powerBoostTypes = {
  phys: "SMT.boostTypes.phys",
  mag: "SMT.boostTypes.mag",
  item: "SMT.boostTypes.item",
} as const;

const skillProperties = {
  critBoost: "SMT.skillProperties.critBoost",
  pinhole: "SMT.skillProperties.pinhole",
  analyze: "SMT.skillProperties.analyze",
  goodInstincts: "SMT.skillProperties.goodInstincts",
  applyFocus: "SMT.skillProperties.applyFocus",
  shatter: "SMT.skillProperties.shatter",
} as const;

export const SMT = {
  templatePaths,
  charClasses,
  stats,
  targetNumbers,
  levelTables: {
    fiend: fiendLevelTable,
    demon: demonLevelTable,
    human: humanLevelTable,
  },
  clans,
  inheritTraits,
  affinities,
  defenseAffinities,
  affinityLevels,
  ailments,
  itemTypes,
  equipSlots,
  skillTypes,
  damageTypes,
  targets,
  powerBoostTypes,
  statusEffects,
  skillProperties,
} as const;
