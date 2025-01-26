import { ArmorData } from "./types/armor.js";
import { MagatamaData } from "./types/magatama.js";
import { SkillData } from "./types/skill.js";
import { MeleeData } from "./types/melee.js";
import { GunData } from "./types/gun.js";
import { ItemData } from "./types/item.js";

export const ITEMMODELS = {
  item: ItemData,
  melee: MeleeData,
  gun: GunData,
  armor: ArmorData,
  magatama: MagatamaData,
  // demonCard: DemonCardData,
  skill: SkillData,
} as const;
