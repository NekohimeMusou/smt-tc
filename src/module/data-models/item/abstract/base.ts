import { SmtItem } from "../../../document/item/item.js";

export abstract class SmtBaseItemData extends foundry.abstract.TypeDataModel {
  abstract readonly type: ItemType;

  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      ...super.defineSchema(),
      notes: new fields.HTMLField(),
    } as const;
  }
  protected get _systemData() {
    return this as this & Subtype<SmtItem, this["type"]>["system"];
  }
}
