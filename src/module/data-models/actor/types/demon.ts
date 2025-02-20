import { SmtBaseActorData } from "../abstract/base.js";

export class SmtDemonData extends SmtBaseActorData {
  override readonly type = "demon";

  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      ...super.defineSchema(),
      favoredStat: new fields.StringField({
        choices: CONFIG.SMT.stats,
        initial: "st",
      }),
    };
  }
}
