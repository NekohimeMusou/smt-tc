import { SmtActor } from "../../../document/actor/actor.js";
import { AilmentData } from "../../shared/ailment.js";
import { SmtBaseItemData } from "./base.js";

export abstract class AttackData extends SmtBaseItemData {
  declare type: "skill" | "weapon";

  get pierce(): boolean {
    const data = this._systemData;
    const actor = this.parent?.parent as SmtActor;

    return data.affinity === "phys" && actor.system.pierce;
  }

  get damageType(): DamageType {
    const data = this._systemData;

    return data.skillType === "phys" ? "phys" : "mag";
  }

  // TODO: Add "item" type
  get powerBoost(): boolean {
    const data = this._systemData;

    const boostType: PowerBoostType =
      data.skillType === "phys" ? "phys" : "mag";

    const actor = this.parent?.parent as SmtActor;

    return actor.system.powerBoost[boostType];
  }

  get tn(): number {
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

    return tn === "negotiation"
      ? actor.system.tn[tn] + 20
      : actor.system.tn[tn];
  }

  get power(): number {
    const actor = this.parent?.parent as SmtActor;
    const data = this._systemData;

    // if (data.itemType === "gun") {
    //   // TODO: Return gun power
    // }

    const powerType = data.skillType === "phys" ? "phys" : "mag";

    return actor.system.power[powerType];
  }

  get autoFailThreshold(): number {
    const actor = this.parent?.parent as SmtActor;

    return actor.system.autoFailThreshold;
  }

  get critBoost(): boolean {
    const actor = this.parent?.parent as SmtActor;
    const data = this._systemData;

    return (
      data.innateCritBoost || (data.damageType === "phys" && actor.system.might)
    );
  }

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
