import { SmtBaseItemData } from "./base.js";

export abstract class AttackData extends SmtBaseItemData {
  declare type: "skill";

  get damageType(): DamageType {
    const data = this._systemData;

    return data.attackType === "phys" ? "phys" : "mag";
  }

  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      ...super.defineSchema(),
      auto: new fields.BooleanField(),
      attackType: new fields.StringField({ choices: CONFIG.SMT.attackTypes }),
      potency: new fields.NumberField({ integer: true, min: 0 }),
      affinity: new fields.StringField({
        choices: CONFIG.SMT.attackAffinities,
      }),
      target: new fields.StringField({ choices: CONFIG.SMT.targets }),
      ailment: new fields.SchemaField({
        id: new fields.StringField({ choices: CONFIG.SMT.ailmentIds }),
        rate: new fields.NumberField({ integer: true, min: 0, max: 95 }),
      }),
      specialProp: new fields.StringField({ choices: CONFIG.SMT.skillProps }),
      shatterRate: new fields.NumberField({ integer: true, min: 0 }),
      includePowerRoll: new fields.BooleanField(),
    };
  }

  override prepareBaseData() {
    const data = this._systemData;

    if (data.affinity === "phys") {
      data.shatterRate = 30;
    } else if (data.affinity !== "force") {
      data.shatterRate = 0;
    }
  }
}
