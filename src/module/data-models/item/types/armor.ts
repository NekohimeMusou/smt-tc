import { SmtBaseItemData } from "../abstract/base.js";

export class ArmorData extends SmtBaseItemData {
  override readonly type = "armor";
  override readonly equippable = true;

  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      ...super.defineSchema(),
      resist: new fields.SchemaField({
        phys: new fields.NumberField({ integer: true, min: 0 }),
        mag: new fields.NumberField({ integer: true, min: 0 }),
      }),
    };
  }
}
