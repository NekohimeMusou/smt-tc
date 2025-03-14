import {
  grantRewards,
  luckyFindCheck,
  resolveConflict,
} from "../helpers/macros/award.js";
import { applyBuffs } from "../helpers/macros/buffs.js";
import { healingFountain } from "../helpers/macros/healing-fountain.js";
import { templatePaths } from "./templates.js";

declare global {
  type CharacterClass = keyof typeof characterClasses;
  type ResourceType = keyof typeof resourceTypes;
  type CostType = keyof typeof costTypes;
  type ItemType = keyof typeof itemTypes;
  type AttackType = keyof typeof attackTypes;
  type SkillType = keyof typeof skillTypes;
  type DamageType = keyof typeof damageTypes;
  type BuffType = keyof typeof buffs;
  type SuccessLevel = keyof typeof successLevels;
  type TargetNumber = keyof typeof tn;
  type DefenseAffinity = keyof typeof defenseAffinities;
  type AttackAffinity = keyof typeof attackAffinities;
  type Affinity = AttackAffinity | DefenseAffinity;
  type AilmentId = keyof typeof ailments;

  // Substitute for the problematic DataModel
  interface Ailment {
    id: keyof typeof ailments;
    rate: number;
  }
}

const characterClasses = {
  fiend: "TYPES.Actor.fiend",
  demon: "TYPES.Actor.demon",
  human: "TYPES.Actor.human",
} as const;

const fiendLevelTable = Array(101)
  .fill(0)
  .map((_, index) => Math.pow(index, 3));
const demonLevelTable = fiendLevelTable.map((xp) => Math.floor(xp * 1.3));
const humanLevelTable = fiendLevelTable.map((xp) => Math.floor(xp * 0.8));

const stats = {
  st: "SMT.statShort.st",
  ma: "SMT.statShort.ma",
  vi: "SMT.statShort.vi",
  ag: "SMT.statShort.ag",
  lu: "SMT.statShort.lu",
} as const;

const statsFull = {
  st: "SMT.statFull.st",
  ma: "SMT.statFull.ma",
  vi: "SMT.statFull.vi",
  ag: "SMT.statFull.ag",
  lu: "SMT.statFull.lu",
} as const;

const resourceTypes = {
  hp: "SMT.resources.hp",
  mp: "SMT.resources.mp",
  fp: "SMT.resources.fp",
} as const;

const costTypes = {
  hp: "SMT.costTypes.hp",
  mp: "SMT.costTypes.mp",
  consumeItem: "SMT.costTypes.consumeItem",
  consumeAmmo: "SMT.costTypes.consumeAmmo",
  none: "SMT.costTypes.none",
} as const;

const attackAffinities = {
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
  support: "SMT.affinities.support",
  healing: "SMT.affinities.healing",
  unique: "SMT.affinities.unique",
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
  none: "SMT.affinityLevels.none",
  weak: "SMT.affinityLevels.weak",
  strong: "SMT.affinityLevels.strong",
  null: "SMT.affinityLevels.null",
  drain: "SMT.affinityLevels.drain",
  repel: "SMT.affinityLevels.repel",
} as const;

const ailments = {
  shock: "SMT.ailments.shock",
  panic: "SMT.ailments.panic",
  sleep: "SMT.ailments.sleep",
  freeze: "SMT.ailments.freeze",
  restrain: "SMT.ailments.restrain",
  mute: "SMT.ailments.mute",
  poison: "SMT.ailments.poison",
  charm: "SMT.ailments.charm",
  stun: "SMT.ailments.stun",
  flied: "SMT.ailments.flied",
  stone: "SMT.ailments.stone",
  instantDeath: "SMT.ailments.instantDeath",
  shatter: "SMT.ailments.shatter",
} as const;

const buffs = {
  tarukaja: "SMT.buffs.tarukaja",
  makakaja: "SMT.buffs.makakaja",
  rakukaja: "SMT.buffs.rakukaja",
  sukukaja: "SMT.buffs.sukukaja",
  tarunda: "SMT.buffs.tarunda",
  rakunda: "SMT.buffs.rakunda",
  sukunda: "SMT.buffs.sukunda",
} as const;

const buffSpells = {
  tarukaja: "SMT.buffs.tarukaja",
  makakaja: "SMT.buffs.makakaja",
  rakukaja: "SMT.buffs.rakukaja",
  sukukaja: "SMT.buffs.sukukaja",
} as const;

const debuffSpells = {
  tarunda: "SMT.buffs.tarunda",
  rakunda: "SMT.buffs.rakunda",
  sukunda: "SMT.buffs.sukunda",
} as const;

const tn = {
  st: "SMT.tn.st",
  ma: "SMT.tn.ma",
  vi: "SMT.tn.vi",
  ag: "SMT.tn.ag",
  lu: "SMT.tn.lu",
  phys: "SMT.tn.phys",
  mag: "SMT.tn.mag",
  save: "SMT.tn.save",
  dodge: "SMT.tn.dodge",
  negotiation: "SMT.tn.negotiation",
  gun: "SMT.tn.gun",
} as const;

const alignment = {
  law: "SMT.alignment.law",
  chaos: "SMT.alignment.chaos",
  dark: "SMT.alignment.dark",
  light: "SMT.alignment.light",
  neutral: "SMT.alignment.neutral",
  heeHo: "SMT.alignment.heeHo",
} as const;

const attackTypes = {
  phys: "SMT.attackTypes.phys",
  mag: "SMT.attackTypes.mag",
  gun: "SMT.attackTypes.gun",
} as const;

const damageTypes = {
  phys: "SMT.attackTypes.phys",
  mag: "SMT.attackTypes.mag",
} as const;

const skillTypes = {
  phys: "SMT.skillTypes.phys",
  mag: "SMT.skillTypes.mag",
  gun: "SMT.skillTypes.gun",
  spell: "SMT.skillTypes.spell",
  passive: "SMT.skillTypes.passive",
  talk: "SMT.skillTypes.talk",
} as const;

const itemTypes = {
  inventoryItem: "TYPES.Item.inventoryItem",
  weapon: "TYPES.Item.weapon",
  armor: "TYPES.Item.armor",
  magatama: "TYPES.Item.magatama",
  skill: "TYPES.Item.skill",
} as const;

const gems = {
  diamond: "SMT.gems.diamond.name",
  pearl: "SMT.gems.pearl.name",
  sapphire: "SMT.gems.sapphire.name",
  emerald: "SMT.gems.emerald.name",
  ruby: "SMT.gems.ruby.name",
  jade: "SMT.gems.jade.name",
  opal: "SMT.gems.opal.name",
  amethyst: "SMT.gems.amethyst.name",
  agate: "SMT.gems.agate.name",
  turquoise: "SMT.gems.turquoise.name",
  garnet: "SMT.gems.garnet.name",
  onyx: "SMT.gems.onyx.name",
  coral: "SMT.gems.coral.name",
  aquamarine: "SMT.gems.aquamarine.name",
} as const;

const gemIcons = {
  diamond: "icons/commodities/gems/gem-faceted-radiant-teal.webp",
  pearl: "icons/commodities/gems/pearl-white-oval.webp",
  sapphire: "icons/commodities/gems/gem-faceted-radiant-blue.webp",
  emerald: "icons/commodities/gems/gem-cut-table-green.webp",
  ruby: "icons/commodities/gems/gem-faceted-radiant-red.webp",
  jade: "icons/commodities/gems/gem-raw-rough-green-yellow.webp",
  opal: "icons/commodities/gems/pearl-natural.webp",
  amethyst: "icons/commodities/gems/gem-cut-faceted-square-purple.webp",
  agate: "icons/commodities/gems/gem-faceted-octagon-yellow.webp",
  turquoise: "icons/commodities/gems/pearl-turquoise.webp",
  garnet: "icons/commodities/gems/gem-rough-navette-red.webp",
  onyx: "icons/commodities/gems/gem-faceted-round-black.webp",
  coral: "icons/commodities/gems/pearl-purple-rough.webp",
  aquamarine: "icons/commodities/gems/gem-shattered-blue.webp",
} as const;

const weaponTypes = {
  melee: "SMT.weaponTypes.melee",
  gun: "SMT.weaponTypes.gun",
  grenade: "SMT.weaponTypes.grenade",
} as const;

const powerBoost = ["phys", "mag", "item"] as const;

const skillProps = {
  critBoost: "SMT.skillProps.critBoost",
  pinhole: "SMT.skillProps.pinhole",
  analyze: "SMT.skillProps.analyze",
  goodInstincts: "SMT.skillProps.goodInstincts",
  applyFocus: "SMT.skillProps.applyFocus",
} as const;

const armorSlots = {
  head: "SMT.armorSlots.head",
  torso: "SMT.armorSlots.torso",
  legs: "SMT.armorSlots.legs",
} as const;

const targets = {
  one: "SMT.targets.one",
  all: "SMT.targets.all",
  self: "SMT.targets.self",
  allCombatants: "SMT.targets.allCombatants",
} as const;

const successLevels = {
  fail: "SMT.successLevel.fail",
  success: "SMT.successLevel.success",
  crit: "SMT.successLevel.crit",
  autofail: "SMT.successLevel.autofail",
  fumble: "SMT.successLevel.fumble",
  auto: "SMT.successLevel.auto",
} as const;

const defaultAutofailThreshold = 96;

export const SMT = {
  templatePaths,
  characterClasses,
  levelTables: {
    fiend: fiendLevelTable,
    demon: demonLevelTable,
    human: humanLevelTable,
  },
  stats,
  statsFull,
  resourceTypes,
  costTypes,
  attackAffinities,
  defenseAffinities,
  affinityLevels,
  ailments,
  buffs,
  buffSpells,
  debuffSpells,
  tn,
  alignment,
  attackTypes,
  damageTypes,
  skillTypes,
  itemTypes,
  gems,
  gemIcons,
  weaponTypes,
  powerBoost,
  skillProps,
  armorSlots,
  targets,
  successLevels,
  defaultAutofailThreshold,
  macro: {
    resolveConflict,
    grantRewards,
    applyBuffs,
    luckyFindCheck,
    healingFountain,
  },
} as const;
