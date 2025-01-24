export class AilmentData extends foundry.abstract.DataModel {
  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      ...super.defineSchema(),
      id: new fields.StringField({ choices: CONFIG.SMT.ailments }),
      rate: new fields.NumberField({ integer: true, min: 5, max: 95 }),
    } as const;
  }
}
