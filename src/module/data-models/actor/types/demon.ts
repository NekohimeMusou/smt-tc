import { SmtBaseActorData } from "../abstract/base.js";

export class SmtDemonData extends SmtBaseActorData {
  override readonly type = "demon";

  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      ...super.defineSchema(),
      species: new fields.StringField(),
      clan: new fields.StringField({ choices: CONFIG.SMT.clans }),
      behavior: new fields.StringField(),
      evolvePath: new fields.StringField(),
      baseLevel: new fields.NumberField({
        integer: true,
        positive: true,
        initial: 1,
      }),
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
