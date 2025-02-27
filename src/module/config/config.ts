import { grantRewards, resolveConflict } from "../helpers/macros/award.js";
import { ailmentIds } from "./statuses.js";

declare global {
  type CharacterClass = keyof typeof characterClasses;
  type ItemType = keyof typeof itemTypes;
  type PowerType = keyof typeof powerTypes;
  type DamageType = keyof typeof damageTypes;
  type PowerBoostType = (typeof powerBoost)[number];
  type BuffType = keyof typeof buffs;
  type SuccessLevel = keyof typeof successLevels;
  type TargetNumber = keyof typeof tn;
}

const templatePaths = [
  // Temporary(?) actor sheet template
  "systems/smt-tc/templates/actor/actor-sheet.hbs",

  // Actor sheet tabs
  "systems/smt-tc/templates/parts/actor/tabs/main.hbs",
  "systems/smt-tc/templates/parts/actor/tabs/inventory.hbs",
  "systems/smt-tc/templates/parts/actor/tabs/bio.hbs",

  // Actor sheet panes
  "systems/smt-tc/templates/parts/actor/header.hbs",
  "systems/smt-tc/templates/parts/actor/resources.hbs",

  // Main tab
  "systems/smt-tc/templates/parts/actor/stats.hbs",
  "systems/smt-tc/templates/parts/actor/derived-stats.hbs",
  "systems/smt-tc/templates/parts/actor/mods.hbs",
  "systems/smt-tc/templates/parts/actor/buffs.hbs",
  "systems/smt-tc/templates/parts/actor/skills.hbs",
  "systems/smt-tc/templates/parts/actor/weapons.hbs",

  // Inventory tab
  "systems/smt-tc/templates/parts/actor/armor.hbs",
  "systems/smt-tc/templates/parts/actor/magatama.hbs",

  // Bio data
  "systems/smt-tc/templates/parts/actor/alignment.hbs",
  "systems/smt-tc/templates/parts/actor/awards.hbs",
  "systems/smt-tc/templates/parts/actor/background.hbs",
  "systems/smt-tc/templates/parts/actor/demon.hbs",

  "systems/smt-tc/templates/parts/affinities.hbs",
  "systems/smt-tc/templates/parts/effects.hbs",

  // Item sheet tabs
  "systems/smt-tc/templates/parts/item/magatama/tabs/main.hbs",

  // Item sheet panes
  "systems/smt-tc/templates/parts/item/header.hbs",
  "systems/smt-tc/templates/parts/item/magatama/stats.hbs",
  "systems/smt-tc/templates/parts/item/magatama/affinities.hbs",
  "systems/smt-tc/templates/parts/item/skill/details.hbs",
  "systems/smt-tc/templates/parts/item/skill/config.hbs",
  "systems/smt-tc/templates/parts/item/weapon/details.hbs",
  "systems/smt-tc/templates/parts/item/weapon/config.hbs",
  "systems/smt-tc/templates/parts/item/armor/config.hbs",
] as const;

const characterClasses = {
  fiend: "SMT.charClasses.fiend",
  demon: "SMT.charClasses.demon",
  human: "SMT.charClasses.human",
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

const powerTypes = {
  phys: "SMT.powerTypes.phys",
  mag: "SMT.powerTypes.mag",
  gun: "SMT.powerTypes.gun",
} as const;

const damageTypes = {
  phys: "SMT.powerTypes.phys",
  mag: "SMT.powerTypes.mag",
} as const;

const attackTypes = {
  phys: "SMT.attackTypes.phys",
  mag: "SMT.attackTypes.mag",
  gun: "SMT.attackTypes.gun",
  spell: "SMT.attackTypes.spell",
  passive: "SMT.attackTypes.passive",
  talk: "SMT.attackTypes.talk",
} as const;

const itemTypes = {
  // item: "SMT.itemTypes.item",
  weapon: "SMT.itemTypes.weapon",
  armor: "SMT.itemTypes.armor",
  magatama: "SMT.itemTypes.magatama",
  skill: "SMT.itemTypes.skill",
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

const equipSlots = {
  none: "SMT.equipSlots.none",
  magatama: "SMT.equipSlots.magatama",
  gun: "SMT.equipSlots.gun",
  melee: "SMT.equipSlots.melee",
  head: "SMT.equipSlots.head",
  torso: "SMT.equipSlots.torso",
  legs: "SMT.equipSlots.legs",
} as const;

const armorSlots = {
  head: "SMT.equipSlots.head",
  torso: "SMT.equipSlots.torso",
  legs: "SMT.equipSlots.legs",
} as const;

const targets = {
  one: "SMT.targets.one",
  all: "SMT.targets.all",
  self: "SMT.targets.self",
  combatants: "SMT.targets.combatants",
} as const;

const successLevels = {
  fail: "SMT.successLevel.fail",
  success: "SMT.successLevel.success",
  crit: "SMT.successLevel.crit",
  autofail: "SMT.successLevel.autofail",
  fumble: "SMT.successLevel.fumble",
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
  attackAffinities,
  defenseAffinities,
  affinityLevels,
  ailments,
  buffs,
  tn,
  alignment,
  powerTypes,
  damageTypes,
  attackTypes,
  itemTypes,
  weaponTypes,
  powerBoost,
  skillProps,
  equipSlots,
  armorSlots,
  targets,
  successLevels,
  defaultAutofailThreshold,
  ailmentIds,
  resolveConflict,
  grantRewards,
} as const;
