import { AttackData } from "../abstract/attack.js";

export class InventoryItemData extends AttackData {
  override readonly type = "inventoryItem";
  override readonly equippable = true;

  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      ...super.defineSchema(),
      consumeOnUse: new fields.BooleanField(),
    };
  }
}
