import SmtActor from "../../../documents/actor/actor.js";
import { SmtItem } from "../../../documents/item/item.js";
import SmtBaseItemData from "./base.js";

export default abstract class AttackData extends SmtBaseItemData {
  declare type: "skill" | "weapon" | "inventoryItem";

  get damageType(): DamageType {
    const data = this._systemData;

    return data.attackType === "phys" ? "phys" : "mag";
  }

  get tn(): number {
    const actor = this.parent?.parent as SmtActor | undefined;

    if (!actor) {
      return 1;
    }

    const data = this._systemData;

    if (data.auto) {
      return 100;
    }

    let tnType: TargetNumber = "st";

    switch (data.attackType) {
      case "item":
        return 100;
        break;
      case "phys":
        tnType = "phys";
        break;
      case "mag":
      case "spell":
        tnType = "mag";
        break;
      case "gun":
        tnType = "gun";
        break;
      case "passive":
        tnType = "lu";
        break;
      case "talk":
        tnType = "negotiation";
        break;
      default:
        data.attackType satisfies never;
    }

    const tn = actor.system.tn[tnType];

    return data.attackType === "talk" ? tn + 20 : tn;
  }

  get power(): number {
    const actor = this.parent?.parent as SmtActor | undefined;
    const data = this._systemData;
    const potency = data.potency;

    if (!actor) {
      return potency;
    }

    const attackType = data.attackType;
    let power = potency;

    switch (attackType) {
      case "passive":
      case "talk":
        break;
      case "mag":
      case "spell":
      case "item":
        power += actor.system.power.mag;
        break;
      case "phys":
        power += actor.system.power.phys;
        break;
      case "gun":
        power += actor.system.power.gun;
        break;
      default:
        attackType satisfies never;
    }

    return power;
  }

  get powerBoost(): boolean {
    const actor = this.parent?.parent as SmtActor | undefined;

    if (!actor) {
      return false;
    }

    if ((this.parent as SmtItem).type === "inventoryItem") {
      return actor.system.powerBoost.item;
    }

    const damageType = this._systemData.damageType;

    return actor.system.powerBoost[damageType];
  }

  get critBoost(): boolean {
    const actor = this.parent?.parent as SmtActor | undefined;

    if (!actor) {
      return false;
    }

    const data = this._systemData;

    return ["phys", "gun"].includes(data.attackType) && actor.system.mods.might;
  }

  get autoFailThreshold(): number {
    const actor = this.parent?.parent as SmtActor | undefined;

    if (!actor) {
      return CONFIG.SMT.defaultAutofailThreshold;
    }

    return actor.system.autoFailThreshold;
  }

  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      ...super.defineSchema(),
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
      ailment: new fields.SchemaField({
        id: new fields.StringField({ choices: CONFIG.SMT.ailmentIds }),
        rate: new fields.NumberField({ integer: true, min: 0, max: 95 }),
      }),
      shatterRate: new fields.NumberField({ integer: true, min: 0 }),
      includePowerRoll: new fields.BooleanField(),
    };
  }

  override prepareBaseData() {
    const data = this._systemData;

    if (data.attackType === "talk") {
      data.affinity = "talk";
    }

    if (data.affinity === "phys") {
      data.shatterRate = 30;
    } else if (data.affinity !== "force") {
      data.shatterRate = 0;
    }
  }
}
