import { SkillListing } from "../../shared/skill-listing.js";
import { EquipmentData } from "../abstract/equipment.js";

export class MagatamaData extends EquipmentData {
  override readonly type = "magatama";

  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      ...super.defineSchema(),
      skills: new fields.ArrayField(new fields.EmbeddedDataField(SkillListing)),
      stats: new fields.SchemaField({
        st: new fields.NumberField({ integer: true, min: 0 }),
        ma: new fields.NumberField({ integer: true, min: 0 }),
        vi: new fields.NumberField({ integer: true, min: 0 }),
        ag: new fields.NumberField({ integer: true, min: 0 }),
        lu: new fields.NumberField({ integer: true, min: 0 }),
      }),
      skillList: new fields.ArrayField(
        new fields.EmbeddedDataField(SkillListing),
      ),
    } as const;
  }
}
