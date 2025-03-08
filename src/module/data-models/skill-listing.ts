import { Magatama } from "./item/item-data-model.js";

type SkillListingModel = Magatama;

export default class SkillListing extends foundry.abstract.DataModel {
  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      name: new fields.StringField(),
      lv: new fields.NumberField({ integer: true, positive: true, initial: 1 }),
      learned: new fields.BooleanField(),
    } as const;
  }

  protected get _systemData() {
    return this as this & SkillListingModel["system"]["skills"];
  }
}
