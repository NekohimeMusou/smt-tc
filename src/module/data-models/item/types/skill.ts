import { AttackData } from "../abstract/attack.js";

export class SkillData extends AttackData {
  override readonly type = "skill";

  static override defineSchema() {
    return {
      ...super.defineSchema(),
    } as const;
  }
}
