import { AttackData } from "./attack.js";

// TODO: Make a common "weapon" abstract class for melee and guns to descend from?
export abstract class WeaponData extends AttackData {
  declare type: "melee" | "gun" | "item";

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
