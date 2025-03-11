import SmtActor from "../../documents/actor/actor.js";
import { Magatama } from "../item/item-data-model.js";

type DefenseAffinityDocument = Magatama | SmtActor;

export default class DefenseAffinityData extends foundry.abstract.DataModel {
  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      phys: new fields.StringField({
        choices: CONFIG.SMT.affinityLevels,
        initial: "none",
      }),
      fire: new fields.StringField({
        choices: CONFIG.SMT.affinityLevels,
        initial: "none",
      }),
      cold: new fields.StringField({
        choices: CONFIG.SMT.affinityLevels,
        initial: "none",
      }),
      elec: new fields.StringField({
        choices: CONFIG.SMT.affinityLevels,
        initial: "none",
      }),
      force: new fields.StringField({
        choices: CONFIG.SMT.affinityLevels,
        initial: "none",
      }),
      light: new fields.StringField({
        choices: CONFIG.SMT.affinityLevels,
        initial: "none",
      }),
      dark: new fields.StringField({
        choices: CONFIG.SMT.affinityLevels,
        initial: "none",
      }),
      mind: new fields.StringField({
        choices: CONFIG.SMT.affinityLevels,
        initial: "none",
      }),
      nerve: new fields.StringField({
        choices: CONFIG.SMT.affinityLevels,
        initial: "none",
      }),
      ruin: new fields.StringField({
        choices: CONFIG.SMT.affinityLevels,
        initial: "none",
      }),
      ailment: new fields.StringField({
        choices: CONFIG.SMT.affinityLevels,
        initial: "none",
      }),
      almighty: new fields.StringField({
        choices: CONFIG.SMT.affinityLevels,
        initial: "none",
      }),
    };
  }

  protected get _systemData() {
    return this as this & DefenseAffinityDocument["system"]["affinities"];
  }
}
