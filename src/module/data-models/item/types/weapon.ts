import AttackDataModel from "../../attack.js";
import SmtBaseItemData from "../abstract/base.js";

export default class WeaponData extends SmtBaseItemData {
  override readonly type = "weapon";
  override readonly equippable = true;

  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      ...super.defineSchema(),
      weaponType: new fields.StringField({ choices: CONFIG.SMT.weaponTypes }),
      ammo: new fields.SchemaField({
        max: new fields.NumberField({ integer: true, positive: true }),
        value: new fields.NumberField({ integer: true, min: 0 }),
      }),
      attackData: new fields.EmbeddedDataField(AttackDataModel),
    };
  }

  override prepareBaseData() {
    super.prepareBaseData();
    const data = this._systemData;

    const attackData = data.attackData;
    const weaponType = data.weaponType;

    attackData.attackType = weaponType === "melee" ? "phys" : "gun";
    attackData.target = weaponType === "grenade" ? "all" : "one";
    attackData.includePowerRoll = true;
  }
}
