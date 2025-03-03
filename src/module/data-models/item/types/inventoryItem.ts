import { AttackData } from "../abstract/attack.js";

export class InventoryItemData extends AttackData {
  override readonly type = "inventoryItem";
  override readonly equippable = true;
}
