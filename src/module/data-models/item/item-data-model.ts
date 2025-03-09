import ArmorData from "./types/armor.js";
import InventoryItemData from "./types/inventoryItem.js";
import MagatamaData from "./types/magatama.js";
import SkillData from "./types/skill.js";
import WeaponData from "./types/weapon.js";

export const ITEMMODELS = {
  inventoryItem: InventoryItemData,
  weapon: WeaponData,
  armor: ArmorData,
  magatama: MagatamaData,
  skill: SkillData,
} as const;
