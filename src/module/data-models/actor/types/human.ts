import { SmtActor } from "../../../document/actor/actor.js";
import { SmtBaseActorModel } from "./base.js";

export class SmtHumanData extends SmtBaseActorModel {
  override readonly type = "human";

  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      ...super.defineSchema(),
      subclass: new fields.StringField(),
    } as const;
  }

  override prepareBaseData(): void {
    super.prepareBaseData();

    const data = this._systemData;
    const actor = this.parent as SmtActor;
    const armor = actor.items.filter((item) => item.system.equipped);

    // Add equipment phys/mag resist
    const armorPhysBonus = armor
      .map((item) => item.system.resistBonus.phys)
      .reduce((prev, curr) => prev + curr, 0);
    const armorMagBonus = armor
      .map((item) => item.system.resistBonus.mag)
      .reduce((prev, curr) => prev + curr, 0);

    data.resist.phys += armorPhysBonus;
    data.resist.mag += armorMagBonus;
  }
}
