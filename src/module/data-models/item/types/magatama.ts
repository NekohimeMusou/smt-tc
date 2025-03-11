import DefenseAffinityData from "../../embedded/defense-affinities.js";
import SmtBaseItemData from "../abstract/base.js";

export default class MagatamaData extends SmtBaseItemData {
  override readonly type = "magatama";

  override readonly equippable = true;

  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      ...super.defineSchema(),
      stats: new fields.SchemaField({
        st: new fields.NumberField({ integer: true, min: 0 }),
        ma: new fields.NumberField({ integer: true, min: 0 }),
        vi: new fields.NumberField({ integer: true, min: 0 }),
        ag: new fields.NumberField({ integer: true, min: 0 }),
        lu: new fields.NumberField({ integer: true, min: 0 }),
      }),
      ingested: new fields.BooleanField(),
      affinities: new fields.EmbeddedDataField(DefenseAffinityData),
    } as const;
  }
}
