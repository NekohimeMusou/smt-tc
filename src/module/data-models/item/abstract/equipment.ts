import affinityFields from "../../shared/affinities.js";
import { SmtBaseItemData } from "./base.js";

export abstract class EquipmentData extends SmtBaseItemData {
  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      ...super.defineSchema(),
      equipSlot: new fields.StringField({
        choices: CONFIG.SMT.equipSlots,
      }),
      affinities: new fields.SchemaField(affinityFields()),
      // Display affinity pane on sheet?
    } as const;
  }
}
