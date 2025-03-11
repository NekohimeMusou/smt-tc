import AttackDataModel from "../../embedded/attack.js";
import SmtBaseItemData from "../abstract/base.js";

export default class SkillData extends SmtBaseItemData {
  override readonly type = "skill";

  override readonly equippable = false;

  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      ...super.defineSchema(),
      oneShot: new fields.BooleanField(),
      used: new fields.BooleanField(),
      inheritanceTraits: new fields.StringField(),
      cost: new fields.NumberField({ integer: true, min: 0 }),
      attackData: new fields.EmbeddedDataField(AttackDataModel),
    };
  }

  override prepareBaseData() {
    const attackData = this._systemData.attackData;

    if (attackData.attackType === "talk") {
      attackData.affinity = "talk";
    }

    if (attackData.affinity === "phys") {
      attackData.shatterRate = 30;
    } else if (attackData.affinity !== "force") {
      attackData.shatterRate = 0;
    }
  }
}
