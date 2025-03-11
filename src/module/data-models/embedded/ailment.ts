export default class Ailment extends foundry.abstract.DataModel {
  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      id: new fields.StringField({ choices: CONFIG.SMT.ailments, blank: true }),
      rate: new fields.NumberField({
        integer: true,
        min: 5,
        max: 95,
        initial: 5,
      }),
    };
  }
}
