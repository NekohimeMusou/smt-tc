import { SmtItem } from "../../../documents/item/item.js";

export default abstract class SmtBaseItemData extends foundry.abstract
  .TypeDataModel {
  abstract override readonly type: ItemType;

  abstract readonly equippable: boolean;

  static override migrateData(source: Record<string, unknown>) {
    // Fix old "combatants" to "allCombatants"
    if ("target" in source && source.target === "combatants") {
      source.target = "allCombatants";
    }

    if (
      !("attackData" in source) &&
      ["inventoryItem", "weapon", "skill"].includes(source?.type as string)
    ) {
      source.attackData = {};
    }

    for (const field of [
      "auto",
      "attackType",
      "potency",
      "affinity",
      "target",
      "ailment",
      "shatterRate",
      "hasPowerRoll",
    ]) {
      if (field in source && "attackData" in source) {
        // @ts-expect-error I don't have patience for this :<
        source.attackData[field] = source[field];
        delete source[field];
      }
    }

    if ("inheritanceTraits" in source) {
      source.inheritType = source.inheritanceTraits;
      delete source.inheritanceTraits;
    }

    return super.migrateData(source);
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
      cost: new fields.NumberField({ integer: true, min: 0 }),
      costType: new fields.StringField({
        choices: CONFIG.SMT.costTypes,
        initial: "none",
      }),
      costsAll: new fields.BooleanField(),
    } as const;
  }

  // Goofy Typescript hack
  get _systemData() {
    return this as this & Subtype<SmtItem, this["type"]>["system"];
  }
}
