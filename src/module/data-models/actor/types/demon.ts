import { SmtBaseActorModel } from "./base.js";

export class SmtDemonData extends SmtBaseActorModel {
  override readonly type = "demon";

  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      ...super.defineSchema(),
      species: new fields.StringField(),
    } as const;
  }

  override prepareBaseData(): void {
    const data = this._systemData;

    // @ts-expect-error This isn't readonly
    data.hpMultiplier = 6;
    // @ts-expect-error This isn't readonly
    data.mpMultiplier = 4;
  }
}
