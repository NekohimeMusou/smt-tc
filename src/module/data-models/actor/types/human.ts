import { Armor } from "../../../documents/item/item.js";
import SmtBaseActorData from "../abstract/base.js";

export default class SmtHumanData extends SmtBaseActorData {
  override readonly type = "human";

  override prepareBaseData() {
    super.prepareBaseData();
    const data = this._systemData;

    // @ts-expect-error This isn't readonly
    data.hpMultiplier = 4;
    // @ts-expect-error This isn't readonly
    data.mpMultiplier = 2;
  }

  override prepareDerivedData() {
    super.prepareDerivedData();

    const actor = this.actor;
    const data = this._systemData;

    const equippedArmor = actor.items.filter(
      (item) => item.type === "armor" && item.system.equipped,
    ) as Armor[];

    const armorPhysResist = equippedArmor.reduce(
      (total, armor) => total + armor.system.resist.phys,
      0,
    );

    const armorMagResist = equippedArmor.reduce(
      (total, armor) => total + armor.system.resist.mag,
      0,
    );

    data.resist.phys += armorPhysResist;
    data.resist.mag += armorMagResist;
  }
}
