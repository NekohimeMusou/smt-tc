import { SmtItem } from "../../documents/item/item.js";
import { MagatamaData } from "./types/magatama.js";
import { SkillData } from "./types/skill.js";

export type Magatama = Subtype<SmtItem, "magatama">;
export type Skill = Subtype<SmtItem, "skill">;

export const ITEMMODELS = {
  magatama: MagatamaData,
  skill: SkillData,
} as const;
