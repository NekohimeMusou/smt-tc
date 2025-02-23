import { AttackData } from "../abstract/attack.js";

export class SkillData extends AttackData {
  override readonly type = "skill";

  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      ...super.defineSchema(),
      oneShot: new fields.BooleanField(),
      expended: new fields.BooleanField(),
      inheritanceTraits: new fields.StringField(),
      cost: new fields.NumberField({ integer: true, min: 0 }),
    };
  }
}
