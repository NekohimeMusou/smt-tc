import { SmtPhysicalItemData } from "./physical.js";

export abstract class SmtEquipmentData extends SmtPhysicalItemData {
  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      ...super.defineSchema(),
      equipped: new fields.BooleanField(),
      equipSlot: new fields.StringField({
        choices: CONFIG.SMT.equipSlots,
        initial: "none",
      }),
    } as const;
  }
}
