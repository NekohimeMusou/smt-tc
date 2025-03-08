import Ailment from "./ailment.js";
import BaseEmbeddedDataModel from "./base-embedded-data.js";
import { AttackItem } from "./item/item-data-model.js";

export default class AttackDataModel extends BaseEmbeddedDataModel {
  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      auto: new fields.BooleanField(),
      attackType: new fields.StringField({
        choices: {
          ...CONFIG.SMT.attackTypes,
          item: "SMT.attackTypes.item",
        },
        initial: "phys",
      }),
      potency: new fields.NumberField({ integer: true, min: 0 }),
      affinity: new fields.StringField({
        choices: {
          ...CONFIG.SMT.attackAffinities,
          talk: "SMT.affinities.talk",
        },
        initial: "phys",
      }),
      target: new fields.StringField({
        choices: CONFIG.SMT.targets,
        initial: "one",
      }),
      ailment: new fields.EmbeddedDataField(Ailment),
      shatterRate: new fields.NumberField({ integer: true, min: 0 }),
      includePowerRoll: new fields.BooleanField(),
    };
  }

  protected get _systemData() {
    return this as this & AttackItem["system"]["attackData"];
  }
}
