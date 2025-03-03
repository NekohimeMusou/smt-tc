import AttackData from "../abstract/attack.js";

export default class SkillData extends AttackData {
  override readonly type = "skill";

  override readonly equippable = false;

  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      ...super.defineSchema(),
      oneShot: new fields.BooleanField(),
      used: new fields.BooleanField(),
      inheritanceTraits: new fields.StringField(),
      cost: new fields.NumberField({ integer: true, min: 0 }),
    };
  }
}
