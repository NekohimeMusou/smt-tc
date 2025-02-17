import { DefenseAffinityData } from "../../defense-affinities.js";

export abstract class SmtBaseItemData extends foundry.abstract.TypeDataModel {
  abstract readonly type: ItemType;

  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      description: new fields.HTMLField(),
      qty: new fields.NumberField({
        integer: true,
        positive: true,
        initial: 1,
      }),
      price: new fields.NumberField({ integer: true, min: 0 }),
      equipped: new fields.BooleanField(),
      equipSlot: new fields.StringField({ choices: CONFIG.SMT.equipSlots }),
      affinities: new fields.EmbeddedDataField(DefenseAffinityData),
    } as const;
  }
}
