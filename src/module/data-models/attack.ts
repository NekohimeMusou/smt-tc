export default class AttackDataModel extends foundry.abstract.DataModel {
  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      auto: new fields.BooleanField(),
      attackType: new fields.StringField({
        choices: CONFIG.SMT.attackTypes,
        initial: "phys",
      }),
      potency: new fields.NumberField({ integer: true, min: 0 }),
    };
  }
}
