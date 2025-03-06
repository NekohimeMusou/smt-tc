import { SmtItem } from "../../../documents/item/item.js";

export default abstract class SmtBaseItemData extends foundry.abstract
  .TypeDataModel {
  abstract override readonly type: ItemType;

  abstract readonly equippable: boolean;

  static override migrateData(source: Record<string, unknown>) {
    if ("target" in source && source.target === "combatants") {
      source.target = "allCombatants";
    }

    return source;
  }

  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      description: new fields.HTMLField(),
      qty: new fields.NumberField({
        integer: true,
        min: 0,
        initial: 1,
      }),
      price: new fields.NumberField({ integer: true, min: 0 }),
      equipped: new fields.BooleanField(),
    } as const;
  }

  // Goofy Typescript hack
  protected get _systemData() {
    return this as this & Subtype<SmtItem, this["type"]>["system"];
  }
}
