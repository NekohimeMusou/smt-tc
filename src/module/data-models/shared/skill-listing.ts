export class SkillListing extends foundry.abstract.DataModel {
  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      name: new fields.StringField(),
      learnLevel: new fields.NumberField({ integer: true, positive: true }),
    } as const;
  }
}
