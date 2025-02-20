export class SkillListing extends foundry.abstract.DataModel {
  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      name: new fields.StringField(),
      lv: new fields.NumberField({ integer: true, positive: true, initial: 1 }),
      learned: new fields.BooleanField(),
    } as const;
  }
}
