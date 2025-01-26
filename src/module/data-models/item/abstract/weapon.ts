import { AttackData } from "./attack.js";

// TODO: Make a common "weapon" abstract class for melee and guns to descend from?
export abstract class WeaponData extends AttackData {
  declare type: "melee" | "gun";

  abstract readonly equipSlot: "melee" | "gun";

  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      ...super.defineSchema(),
      equipped: new fields.BooleanField(),
      price: new fields.NumberField({ integer: true, min: 0 }),
    } as const;
  }

  override prepareBaseData() {
    super.prepareBaseData();
    const data = this._systemData;

    // @ts-expect-error Field isn't readonly
    data.affinity = "phys";
    // @ts-expect-error Field isn't readonly
    data.rollPower = true;
    // @ts-expect-error Field isn't readonly
    data.target = "oneEnemy";
  }
}
