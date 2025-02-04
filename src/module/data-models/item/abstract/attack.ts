import { SmtActor } from "../../../document/actor/actor.js";
import { SmtBaseItemData } from "./base.js";

export abstract class AttackData extends SmtBaseItemData {
  declare type: "skill" | "melee" | "gun" | "item";

  get pierce(): boolean {
    const data = this._systemData;
    const actor = this.parent?.parent as SmtActor;

    return data.affinity === "phys" && actor.system.pierce;
  }

  get damageType(): DamageType {
    const data = this._systemData;

    return data.type === "gun" || data.skillType === "phys" ? "phys" : "mag";
  }

  get powerBoost(): boolean {
    const actor = this.parent?.parent as SmtActor;
    const data = this._systemData;

    if (data.type === "item") {
      return actor.system.powerBoost.item;
    }

    const boostType: PowerBoostType =
      data.type === "gun" || data.skillType === "phys" ? "phys" : "mag";

    return actor.system.powerBoost[boostType];
  }

  get tn(): number {
    const data = this._systemData;
    const actor = this.parent?.parent as SmtActor;

    let tn: TargetNumber = "st";

    if (data.auto) {
      return 100;
    }

    if (data.type === "gun") {
      tn = "ag";
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

    if (data.type === "gun") {
      return actor.system.power.gun;
    }

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
      data.specialProps === "critBoost" || (data.damageType === "phys" && actor.system.might)
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
      ailment: new fields.SchemaField({
        id: new fields.StringField({ choices: CONFIG.SMT.statusEffects }),
        rate: new fields.NumberField({ integer: true, min: 0, max: 95 }),
      }),
      // Status to apply automatically to target/self
      specialProps: new fields.StringField({
        choices: CONFIG.SMT.skillProperties,
      }),
      shatterRate: new fields.NumberField({ integer: true, min: 0 }),
    } as const;
  }

  override prepareBaseData() {
    const data = this._systemData;

    if (data.affinity === "phys") {
      //@ts-expect-error Field isn't readonly
      data.shatterRate = 30;
    } else if (data.affinity !== "force") {
      //@ts-expect-error Field isn't readonly
      data.shatterRate = 0;
    }
  }
}
