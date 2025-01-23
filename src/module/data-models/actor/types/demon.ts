import { SmtBaseActorData } from "../abstract/base.js";

export class SmtDemonData extends SmtBaseActorData {
  override readonly type = "demon";

  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      ...super.defineSchema(),
      species: new fields.StringField(),
      clan: new fields.StringField({ choices: CONFIG.SMT.clans }),
      // Not gonna get fancy with this one
      evolvePath: new fields.StringField(),
      inheritTraits: new fields.SchemaField({
        mouth: new fields.BooleanField(),
        eye: new fields.BooleanField(),
        lunge: new fields.BooleanField(),
        weapon: new fields.BooleanField(),
        claw: new fields.BooleanField(),
        teeth: new fields.BooleanField(),
        wing: new fields.BooleanField(),
      }),
    } as const;
  }
}
