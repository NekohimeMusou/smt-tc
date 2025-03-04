import AttackData from "../abstract/attack.js";

export default class InventoryItemData extends AttackData {
  override readonly type = "inventoryItem";
  override readonly equippable = false;

  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      ...super.defineSchema(),
      consumeOnUse: new fields.BooleanField(),
      hasAttack: new fields.BooleanField(),
    };
  }

  override prepareBaseData() {
    const data = this._systemData;

    data.attackType = "mag";
    data.auto = true;
  }
}
