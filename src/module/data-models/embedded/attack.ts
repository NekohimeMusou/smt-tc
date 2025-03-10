import { AttackItem } from "../../documents/item/item.js";
import BaseEmbeddedDataModel from "./base-embedded-data.js";

export default class AttackDataModel extends BaseEmbeddedDataModel {
  get damageType(): DamageType {
    const data = this._systemData;

    return data.attackType === "phys" ? "phys" : "mag";
  }

  get tn() {
    const actor = this.actor;

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

  get totalPower() {
    const actor = this.actor;
    const data = this._systemData;
    const potency = data.potency;

    if (!actor) {
      return potency;
    }

    const basePower = data.basePower;

    return Math.max(potency + basePower, 0);
  }

  get basePower() {
    const actor = this.actor;
    const data = this._systemData;
    const attackType = data.attackType;

    let powerType: PowerType = "phys";

    switch (attackType) {
      case "passive":
      case "talk":
        return 0;
      case "phys":
        powerType = "phys";
        break;
      case "gun":
        powerType = "gun";
        break;
      case "item":
      case "mag":
      case "spell":
        powerType = "mag";
        break;
      default:
        attackType satisfies never;
    }

    return actor ? actor.system.power[powerType] : 0;
  }

  get powerBoost() {
    const actor = this.actor;
    const item = this.item;

    if (!actor || !item) {
      return false;
    }

    if (item.type === "inventoryItem") {
      return actor.system.powerBoost.item;
    }

    const damageType = this._systemData.damageType;

    return actor.system.powerBoost[damageType];
  }

  get critBoost() {
    const actor = this.actor;

    if (!actor) {
      return false;
    }

    const data = this._systemData;

    return ["phys", "gun"].includes(data.attackType) && actor.system.mods.might;
  }

  get autoFailThreshold() {
    const actor = this.actor;

    if (!actor) {
      return CONFIG.SMT.defaultAutofailThreshold;
    }

    return actor.system.autoFailThreshold;
  }

  static override migrateData(source: Record<string, unknown>) {
    if ("includePowerRoll" in source) {
      source.hasPowerRoll = source.includePowerRoll;
      delete source.includePowerRoll;
    }

    return super.migrateData(source);
  }

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
      ailment: new fields.SchemaField({
        id: new fields.StringField({
          choices: CONFIG.SMT.ailments,
          blank: true,
        }),
        rate: new fields.NumberField({
          integer: true,
          min: 5,
          max: 95,
          initial: 5,
        }),
      }),
      shatterRate: new fields.NumberField({ integer: true, min: 0 }),
      hasPowerRoll: new fields.BooleanField(),
      canDodge: new fields.BooleanField(),
    };
  }

  get _systemData() {
    return this as this & AttackItem["system"]["attackData"];
  }
}
