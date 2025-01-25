import { AttackData } from "../abstract/attack.js";

export class WeaponData extends AttackData {
  override readonly type = "weapon";

  readonly equipSlot = "weapon";

  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      ...super.defineSchema(),
      equipped: new fields.BooleanField(),
      price: new fields.NumberField({ integer: true, min: 0 }),
    } as const;
  }
}
