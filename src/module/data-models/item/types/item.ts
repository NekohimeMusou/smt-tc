import { WeaponData } from "../abstract/weapon.js";

export class ItemData extends WeaponData {
  override readonly type = "item";

  override prepareBaseData() {
    super.prepareBaseData();
    const data = this._systemData;

    // @ts-expect-error Field isn't readonly
    data.auto = true;
    // @ts-expect-error Field isn't readonly
    data.skillType = "mag";
  }
}
