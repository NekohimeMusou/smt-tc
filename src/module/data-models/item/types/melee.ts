import { WeaponData } from "../abstract/weapon.js";

export class MeleeData extends WeaponData {
  override readonly type = "melee";

  readonly equipSlot = "melee";

  override prepareBaseData(): void {
    super.prepareBaseData();
    const data = this._systemData;

    // @ts-expect-error Field isn't readonly
    data.skillType = "phys";
  }
}
