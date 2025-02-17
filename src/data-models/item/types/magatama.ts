import { SkillListing } from "../../skill-listing.js";
import { SmtBaseItemData } from "../abstract/base.js";

export class MagatamaData extends SmtBaseItemData {
  override readonly type = "magatama";

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
      skills: new fields.ArrayField(new fields.EmbeddedDataField(SkillListing)),
    } as const;
  }
}
