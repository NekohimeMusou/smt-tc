import AttackDataModel from "../../embedded/attack.js";
import SmtBaseItemData from "../abstract/base.js";

export default class InventoryItemData extends SmtBaseItemData {
  override readonly type = "inventoryItem";
  override readonly equippable = false;

  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      ...super.defineSchema(),
      // TODO: See if we can factor this out/combine it
      consumeOnUse: new fields.BooleanField(),
      hasAttack: new fields.BooleanField(),
      attackData: new fields.EmbeddedDataField(AttackDataModel),
    };
  }

  override prepareBaseData() {
    const attackData = this._systemData.attackData;

    attackData.attackType = "mag";
    attackData.auto = true;
  }
}
