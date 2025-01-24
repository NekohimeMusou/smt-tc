import { ArmorData } from "./types/armor.js";
import { MagatamaData } from "./types/magatama.js";
import { SkillData } from "./types/skill.js";
import { WeaponData } from "./types/weapon.js";

export const ITEMMODELS = {
  // item: ItemData,
  weapon: WeaponData,
  // gun: GunData,
  armor: ArmorData,
  magatama: MagatamaData,
  // demonCard: DemonCardData,
  skill: SkillData,
} as const;
