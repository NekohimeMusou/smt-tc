import { SmtBaseItemData } from "./base.js";

export abstract class PhysicalItemData extends SmtBaseItemData {
  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      ...super.defineSchema(),
      qty: new fields.NumberField({ integer: true, min: 1 }),
      price: new fields.NumberField({ integer: true, min: 0 }),
    } as const;
  }
}
