import { SmtEquipmentData } from "./equipment.js";

export class SmtArmorData extends SmtEquipmentData {
  override readonly type = "armor";

  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      ...super.defineSchema(),
      resistBonus: new fields.SchemaField({
        phys: new fields.NumberField({ integer: true, initial: 0 }),
        mag: new fields.NumberField({ integer: true, initial: 0 }),
      }),
    } as const;
  }
}
