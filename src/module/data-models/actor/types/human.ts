import { SmtActor } from "../../../document/actor/actor.js";
import { Armor } from "../../../document/item/item.js";
import { SmtBaseActorData } from "../abstract/base.js";

export class SmtHumanData extends SmtBaseActorData {
  override readonly type = "human";

  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      ...super.defineSchema(),
      subclass: new fields.StringField(),
    } as const;
  }

  override prepareBaseData() {
    super.prepareBaseData();

    const data = this._systemData;
    const actor = this.parent as SmtActor;
    const equippedArmor = actor.items.filter(
      (item) => item.system.type === "armor" && item.system.equipped,
    ) as Armor[];

    // Add equipment phys/mag resist
    const armorPhysBonus = equippedArmor
      .map((item) => item.system.resistBonus.phys)
      .reduce((prev, curr) => prev + curr, 0);
    const armorMagBonus = equippedArmor
      .map((item) => item.system.resistBonus.mag)
      .reduce((prev, curr) => prev + curr, 0);

    data.resist.phys += armorPhysBonus;
    data.resist.mag += armorMagBonus;
  }
}
