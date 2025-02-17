import { DefenseAffinityData } from "../../defense-affinities.js";
import { SmtBaseItemData } from "./base.js";

export abstract class AffinityItemData extends SmtBaseItemData {
  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      ...super.defineSchema(),
      affinities: new fields.EmbeddedDataField(DefenseAffinityData),
    };
  }
}
