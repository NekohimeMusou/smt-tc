import { AttackItem } from "../../documents/item/item.js";
import BaseEmbeddedDataModel from "./abstract/base-embedded-data.js";

export default class AttackDataModel extends BaseEmbeddedDataModel {
  get damageType(): DamageType {
    const data = this._systemData;

    return data.attackType === "phys" || data.attackType === "gun"
      ? "phys"
      : "mag";
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

    return Math.max(data.attackType === "talk" ? tn + 20 : tn, 1);
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

    let powerType: AttackType = "phys";

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

    return (
      (["phys", "gun"].includes(data.attackType) && actor.system.mods.might) ||
      data.mods.highCrit
    );
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

    if ("shatterRate" in source) {
      if (source.affinity === "force") {
        source.ailment = {
          id: "shatter",
          rate: source.shatterRate,
        };
      }
      delete source.shatterRate;
    }

    // Set this to true so the button will show up by default if you forget
    if ("canDodge" in source) {
      const passiveOrTalk =
        "attackType" in source &&
        (source.attackType === "passive" || source.attackType === "talk");
      source.canBeDodged = passiveOrTalk ? false : true;
      delete source.canDodge;
    }

    return super.migrateData(source);
  }

  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      auto: new fields.BooleanField(),
      attackType: new fields.StringField({
        choices: {
          ...CONFIG.SMT.skillTypes,
          item: "SMT.skillTypes.item",
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
      status: new fields.StringField({
        blank: true,
        choices: CONFIG.SMT.statuses,
      }),
      hasPowerRoll: new fields.BooleanField(),
      canBeDodged: new fields.BooleanField(),
      mods: new fields.SchemaField({
        highCrit: new fields.BooleanField(),
        pinhole: new fields.BooleanField(),
      }),
    };
  }

  get _systemData() {
    return this as this & AttackItem["system"]["attackData"];
  }
}
