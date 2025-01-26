import { WeaponData } from "../abstract/weapon.js";

export abstract class GunData extends WeaponData {
  override readonly type = "gun";

  readonly equipSlot = "gun";

  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      ...super.defineSchema(),
      ammo: new fields.SchemaField({
        min: new fields.NumberField({ integer: true }),
        max: new fields.NumberField({ integer: true, min: 1 }),
        value: new fields.NumberField({ integer: true, initial: 0 }),
      }),
    } as const;
  }
}
