import { WeaponData } from "../abstract/weapon.js";

export class MeleeData extends WeaponData {
  override readonly type = "melee";
}
