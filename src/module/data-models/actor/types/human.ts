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

  // TODO: Add equipment phys/mag resist to total
  override prepareBaseData(): void {
    // const data = this._systemData;
    // const actor = this.parent as SmtActor;
    // const armor = actor.items.filter((item) => item.system.equipped);
    // Add equipment phys/mag resist
    // const equipPhysResist =
    //   data.charClass !== "human"
    //     ? 0
    //     : equipment
    //         .map((item) => item.system.resistBonus.phys)
    //         .reduce((prev, curr) => prev + curr, 0);
    // const equipMagResist =
    //   data.charClass !== "human"
    //     ? 0
    //     : equipment
    //         .map((item) => item.system.resistBonus.mag)
    //         .reduce((prev, curr) => prev + curr, 0);
  }
}
