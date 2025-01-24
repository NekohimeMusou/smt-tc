import { SmtActor } from "../../../document/actor/actor.js";
import { AilmentData } from "../../shared/ailment.js";
import { SmtBaseItemData } from "./base.js";

export abstract class AttackData extends SmtBaseItemData {
  declare type: "skill" | "weapon";

  get accuracy(): number {
    const data = this._systemData;
    const actor = this.parent?.parent as SmtActor;

    let tn: TargetNumber = "st";

    if (data.auto) {
      return 100;
    }

    switch (data.skillType) {
      case "phys":
        tn = "st";
        break;
      case "mag":
      case "spell":
        tn = "ma";
        break;
      case "talk":
        tn = "negotiation";
        break;
      case "passive":
        return 100;
    }

    return actor.system.tn[tn];
  }

  get pierce(): boolean {
    const data = this._systemData;
    const actor = this.parent?.parent as SmtActor;

    return data.affinity === "phys" && actor.system.pierce;
  }

  get damageType(): DamageType {
    const data = this._systemData;

    return data.skillType === "phys" ? "phys" : "mag";
  }

  // get powerBoost(): boolean {
  // }

  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      ...super.defineSchema(),
      auto: new fields.BooleanField(),
      skillType: new fields.StringField({
        choices: CONFIG.SMT.skillTypes,
      }),
      rollPower: new fields.BooleanField(),
      target: new fields.StringField({
        choices: CONFIG.SMT.targets,
      }),
      affinity: new fields.StringField({
        choices: CONFIG.SMT.affinities,
      }),
      potency: new fields.NumberField({ integer: true, min: 0 }),
      ailment: new fields.EmbeddedDataField(AilmentData),
      innateCritBoost: new fields.BooleanField(),
      pinhole: new fields.BooleanField(),
    } as const;
  }
}
