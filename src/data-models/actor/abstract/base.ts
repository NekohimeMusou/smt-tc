import baseSchemaFields from "./base-schema-fields.js";

export abstract class SmtBaseActorData extends foundry.abstract.TypeDataModel {
  abstract readonly type: CharacterClass;

  static override defineSchema() {
    return {
      ...baseSchemaFields(),
    } as const;
  }

  override prepareBaseData() {
    super.prepareBaseData();
  }
}
