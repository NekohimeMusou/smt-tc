import { SmtBaseItemData } from "./base.js";

export abstract class EquipmentData extends SmtBaseItemData {
  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      ...super.defineSchema(),
      equipped: new fields.BooleanField(),
      equipSlot: new fields.StringField({
        choices: CONFIG.SMT.equipSlots,
      }),
    } as const;
  }
}
