import DefenseAffinityData from "../../defense-affinities.js";
import SmtBaseItemData from "../abstract/base.js";
import { SmtItem } from "../../../documents/item/item.js";

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
      skills: new fields.EmbeddedCollectionField(SmtItem, {
        validate: (item: SmtItem) => item.type === "skill",
        validationError: "Magatama can only hold skills.",
      }),
      ingested: new fields.BooleanField(),
      affinities: new fields.EmbeddedDataField(DefenseAffinityData),
    } as const;
  }
}
