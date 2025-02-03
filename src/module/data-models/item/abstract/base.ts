import { SmtItem } from "../../../document/item/item.js";

export abstract class SmtBaseItemData extends foundry.abstract.TypeDataModel {
  abstract readonly type: ItemType;

  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      description: new fields.HTMLField(),
      qty: new fields.NumberField({ integer: true, initial: 1 }),
      price: new fields.NumberField({ integer: true, min: 0 }),
      equipped: new fields.BooleanField(),
    } as const;
  }
  protected get _systemData() {
    return this as this & Subtype<SmtItem, this["type"]>["system"];
  }
}
