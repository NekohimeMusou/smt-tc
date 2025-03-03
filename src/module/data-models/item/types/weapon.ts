import AttackData from "../abstract/attack.js";

export default class WeaponData extends AttackData {
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
    };
  }

  override prepareBaseData() {
    super.prepareBaseData();

    const data = this._systemData;
    const weaponType = data.weaponType;

    data.attackType = weaponType === "melee" ? "phys" : "gun";
    data.target = weaponType === "grenade" ? "all" : "one";
    data.includePowerRoll = true;
    data.equipSlot = weaponType === "melee" ? "melee" : "gun";
  }
}
