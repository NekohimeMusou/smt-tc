import SkillListing from "../../skill-listing.js";
import AffinityItemData from "../abstract/affinity.js";

export default class MagatamaData extends AffinityItemData {
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
      skills: new fields.ArrayField(new fields.EmbeddedDataField(SkillListing)),
      ingested: new fields.BooleanField(),
    } as const;
  }

  override prepareBaseData() {
    const data = this._systemData;

    // @ts-expect-error This isn't readonly
    data.equipSlot = "magatama";
  }
}
