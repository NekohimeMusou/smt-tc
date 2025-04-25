import AttackDataModel from "../../embedded/attack.js";
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
        itemName: new fields.StringField({ initial: "Bullets" }),
      }),
      attackData: new fields.EmbeddedDataField(AttackDataModel),
    };
  }

  static override migrateData(source: Record<string, unknown>) {
    if ("ammoType" in source) {
      foundry.utils.mergeObject(source, {
        ammo: {
          itemName: source.ammoType,
        }
      });

      delete source.ammoType;
    }

    return super.migrateData(source);
  }

  override prepareBaseData() {
    super.prepareBaseData();
    const data = this._systemData;

    const attackData = data.attackData;
    const weaponType = data.weaponType;

    attackData.attackType = weaponType === "melee" ? "phys" : "gun";
    attackData.target = weaponType === "grenade" ? "all" : "one";
    attackData.hasPowerRoll = true;

    switch (data.weaponType) {
      case "gun":
        data.costType = "consumeAmmo";
        data.cost = 1;
        data.slots.melee = false;
        data.slots.gun = true;
        break;
      case "grenade":
        data.costType = "consumeItem";
        data.cost = 1;
        break;
      case "melee":
        data.costType = "none";
        data.cost = 0;
        data.slots.melee = true;
        data.slots.gun = false;
        break;
      default:
        data.weaponType satisfies never;
    }
  }
}
