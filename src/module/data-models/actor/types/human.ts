import SmtActor from "../../../documents/actor/actor.js";
import { Armor } from "../../../documents/item/item.js";
import SmtBaseActorData from "../abstract/base.js";

export default class SmtHumanData extends SmtBaseActorData {
  override readonly type = "human";

  override prepareDerivedData() {
    super.prepareDerivedData();

    const actor = this.parent as SmtActor;
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
