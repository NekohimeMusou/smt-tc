import { SmtItem } from "../../documents/item/item.js";
import ArmorData from "./types/armor.js";
import InventoryItemData from "./types/inventoryItem.js";
import MagatamaData from "./types/magatama.js";
import SkillData from "./types/skill.js";
import WeaponData from "./types/weapon.js";

export type InventoryItem = Subtype<SmtItem, "inventoryItem">;
export type Weapon = Subtype<SmtItem, "weapon">;
export type Armor = Subtype<SmtItem, "armor">;
export type Magatama = Subtype<SmtItem, "magatama">;
export type Skill = Subtype<SmtItem, "skill">;

export const ITEMMODELS = {
  inventoryItem: InventoryItemData,
  weapon: WeaponData,
  armor: ArmorData,
  magatama: MagatamaData,
  skill: SkillData,
} as const;
