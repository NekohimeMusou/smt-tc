import SmtActor from "../../../documents/actor/actor.js";
import { Magatama } from "../../../documents/item/item.js";
import DefenseAffinityData from "../../embedded/defense-affinities.js";

export default abstract class SmtBaseActorData extends foundry.abstract
  .TypeDataModel {
  abstract override readonly type: CharacterClass;

  get actor() {
    return this.parent as SmtActor;
  }

  get lv(): number {
    const data = this._systemData;

    if (data.isNPC) {
      return data.levelOverride;
    }

    return this.#pcLevel;
  }

  get #pcLevel(): number {
    const data = this._systemData;
    const levelTable = CONFIG.SMT.levelTables[this.type];

    return Math.max(
      levelTable.findLastIndex((tableXp) => tableXp < data.xp + 1),
      1,
    );
  }

  get autoFailThreshold() {
    const actor = this.actor;

    if (actor.statuses.has("stun")) {
      return 25;
    }

    if (actor.statuses.has("curse")) {
      return 86;
    }

    return 96;
  }

  get equippedMagatama() {
    // Return `undefined` if this isn't a Fiend
    const actor = this.actor;

    return actor.items.find(
      (item) => item.type === "magatama" && item.system.equipped,
    ) as Magatama | undefined;
  }

  get remainingStatPoints(): number {
    const data = this._systemData;

    const stats = data.stats;

    const statPoints = Object.values(stats).reduce(
      (prev, curr) => prev + curr.lv,
      0,
    );

    return data.lv - data.baseLv - statPoints + data.incenseUsed;
  }

  static override defineSchema() {
    const fields = foundry.data.fields;

    const stats = new fields.SchemaField({
      st: new fields.SchemaField({
        ...generateStatSchema(),
        derivedTN: new fields.StringField({ initial: "phys" }),
      }),
      ma: new fields.SchemaField({
        ...generateStatSchema(),
        derivedTN: new fields.StringField({ initial: "mag" }),
      }),
      vi: new fields.SchemaField({
        ...generateStatSchema(),
        derivedTN: new fields.StringField({ initial: "save" }),
      }),
      ag: new fields.SchemaField({
        ...generateStatSchema(),
        derivedTN: new fields.StringField({ initial: "dodge" }),
      }),
      lu: new fields.SchemaField({
        ...generateStatSchema(),
        derivedTN: new fields.StringField({ initial: "negotiation" }),
      }),
    });

    const resources = {
      hp: new fields.SchemaField({
        max: new fields.NumberField({ integer: true }),
        value: new fields.NumberField({ integer: true }),
        override: new fields.NumberField({ integer: true }),
      }),
      mp: new fields.SchemaField({
        max: new fields.NumberField({ integer: true }),
        value: new fields.NumberField({ integer: true }),
        override: new fields.NumberField({ integer: true }),
      }),
      fp: new fields.SchemaField({
        max: new fields.NumberField({ integer: true }),
        value: new fields.NumberField({ integer: true }),
        override: new fields.NumberField({ integer: true }),
      }),
    };

    const tn = new fields.SchemaField({
      st: new fields.NumberField({ integer: true }),
      ma: new fields.NumberField({ integer: true }),
      vi: new fields.NumberField({ integer: true }),
      ag: new fields.NumberField({ integer: true }),
      lu: new fields.NumberField({ integer: true }),
      phys: new fields.NumberField({ integer: true }),
      mag: new fields.NumberField({ integer: true }),
      save: new fields.NumberField({ integer: true }),
      dodge: new fields.NumberField({ integer: true }),
      negotiation: new fields.NumberField({ integer: true }),
      gun: new fields.NumberField({ integer: true }),
    });

    const power = new fields.SchemaField({
      phys: new fields.NumberField({ integer: true, min: 0 }),
      mag: new fields.NumberField({ integer: true, min: 0 }),
      gun: new fields.NumberField({ integer: true, min: 0 }),
    });

    const resist = new fields.SchemaField({
      phys: new fields.NumberField({ integer: true, min: 0 }),
      mag: new fields.NumberField({ integer: true, min: 0 }),
    });

    const bioData = {
      notes: new fields.HTMLField(),
      bg1: new fields.StringField(),
      bg2: new fields.StringField(),
      contact1: new fields.StringField(),
      contact2: new fields.StringField(),
      contact3: new fields.StringField(),
      bond: new fields.StringField(),
      goal: new fields.StringField(),
      alignment: new fields.SchemaField({
        law: new fields.NumberField({ integer: true, min: 0 }),
        chaos: new fields.NumberField({ integer: true, min: 0 }),
        dark: new fields.NumberField({ integer: true, min: 0 }),
        light: new fields.NumberField({ integer: true, min: 0 }),
        neutral: new fields.NumberField({ integer: true, min: 0 }),
        heeHo: new fields.NumberField({ integer: true, min: 0 }),
      }),
      behavior: new fields.StringField(),
    };

    const awards = new fields.SchemaField({
      xp: new fields.NumberField({ integer: true, min: 0 }),
      macca: new fields.NumberField({ integer: true, min: 0 }),
      itemDrops: new fields.StringField(),
    });

    const sheetData = {
      tnBoosts: new fields.NumberField({ integer: true, initial: 0 }),
      multi: new fields.NumberField({
        integer: true,
        initial: 1,
        positive: true,
        max: 3,
      }),
    };
    const buffs = new fields.SchemaField({
      tarukaja: new fields.NumberField({ integer: true, min: 0, initial: 0 }),
      makakaja: new fields.NumberField({ integer: true, min: 0, initial: 0 }),
      rakukaja: new fields.NumberField({ integer: true, min: 0, initial: 0 }),
      sukukaja: new fields.NumberField({ integer: true, min: 0, initial: 0 }),
      tarunda: new fields.NumberField({ integer: true, min: 0, initial: 0 }),
      rakunda: new fields.NumberField({ integer: true, min: 0, initial: 0 }),
      sukunda: new fields.NumberField({ integer: true, min: 0, initial: 0 }),
    });
    // Modifiers for AEs etc to latch onto
    const mods = new fields.SchemaField({
      might: new fields.BooleanField(),
      luckyFind: new fields.BooleanField(),
    });

    const powerBoost = new fields.SchemaField({
      phys: new fields.BooleanField(),
      mag: new fields.BooleanField(),
      item: new fields.BooleanField(),
    });

    const elementBoost = new fields.SchemaField({
      fire: new fields.BooleanField(),
      cold: new fields.BooleanField(),
      elec: new fields.BooleanField(),
      force: new fields.BooleanField(),
    });

    const gems = new fields.SchemaField({
      diamond: new fields.NumberField({ integer: true, min: 0, initial: 0 }),
      pearl: new fields.NumberField({ integer: true, min: 0, initial: 0 }),
      sapphire: new fields.NumberField({ integer: true, min: 0, initial: 0 }),
      emerald: new fields.NumberField({ integer: true, min: 0, initial: 0 }),
      ruby: new fields.NumberField({ integer: true, min: 0, initial: 0 }),
      jade: new fields.NumberField({ integer: true, min: 0, initial: 0 }),
      opal: new fields.NumberField({ integer: true, min: 0, initial: 0 }),
      amethyst: new fields.NumberField({ integer: true, min: 0, initial: 0 }),
      agate: new fields.NumberField({ integer: true, min: 0, initial: 0 }),
      turquoise: new fields.NumberField({ integer: true, min: 0, initial: 0 }),
      garnet: new fields.NumberField({ integer: true, min: 0, initial: 0 }),
      onyx: new fields.NumberField({ integer: true, min: 0, initial: 0 }),
      coral: new fields.NumberField({ integer: true, min: 0, initial: 0 }),
      aquamarine: new fields.NumberField({ integer: true, min: 0, initial: 0 }),
    });

    return {
      stats,
      ...resources,
      tn,
      power,
      resist,
      ...bioData,
      awards,
      ...sheetData,
      buffs,
      mods,
      powerBoost,
      elementBoost,
      gems,
      baseLv: new fields.NumberField({
        integer: true,
        positive: true,
        initial: 1,
      }),
      incenseUsed: new fields.NumberField({
        integer: true,
        min: 0,
      }),
      hpMultiplier: new fields.NumberField({ integer: true, positive: true }),
      mpMultiplier: new fields.NumberField({ integer: true, positive: true }),
      xp: new fields.NumberField({ integer: true, min: 0 }),
      macca: new fields.NumberField({ integer: true, min: 0 }),
      affinities: new fields.EmbeddedDataField(DefenseAffinityData),
      // Should this be considered an NPC (e.g. level override)
      isNPC: new fields.BooleanField(),
      levelOverride: new fields.NumberField({ integer: true, min: 1 }),
    } as const;
  }

  override prepareBaseData() {
    super.prepareBaseData();
    const data = this._systemData;
    const actor = this.actor;

    // Calculate stat values
    const stats = data.stats;
    const tn = data.tn;
    const lv = data.lv;

    for (const [key, stat] of Object.entries(stats)) {
      // Fiends always have 2 for their base stats
      if (actor.type === "fiend") {
        stat.base = 2;
      }
      const statName = key as keyof typeof data.stats;
      const mgt = data.equippedMagatama?.system.stats[statName] ?? 0;
      stat.value = Math.clamp(stat.base + stat.lv + mgt, 1, 40);

      const statTN = Math.max(stat.value * 5 + lv, 1);
      data.tn[statName] = Math.max(statTN, 1);
    }

    // Set derived TNs
    tn.phys = tn.st;
    tn.mag = tn.ma;
    tn.save = tn.vi;
    tn.dodge = stats.ag.value + 10;
    tn.negotiation = stats.lu.value * 2 + 20;
    tn.gun = 0;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const physResistFormulaChoice = game.settings.get(
      "smt-tc",
      "alternatePhysResistCalc",
    ) as ResistCalcOption;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const magResistFormulaChoice = game.settings.get(
      "smt-tc",
      "alternateMagResistCalc",
    ) as ResistCalcOption;

    data.resist.phys = this.#getBaseResist("phys", physResistFormulaChoice);
    data.resist.mag = this.#getBaseResist("mag", magResistFormulaChoice);

    const addLevelToGunPower = game.settings.get(
      "smt-tc",
      "addLevelToGunPower",
    );

    data.power.phys = Math.max(stats.st.value + lv, 0);
    data.power.mag = Math.max(stats.ma.value + lv, 0);
    data.power.gun = Math.max(
      stats.ag.value + (addLevelToGunPower ? lv : 0),
      0,
    );

    // Calculate HP/MP/FP max
    data.hp.max = data.isNPC ? data.hp.override : this.calculateMax("hp");
    data.mp.max = data.isNPC ? data.mp.override : this.calculateMax("mp");
    data.fp.max = data.isNPC ? data.fp.override : this.calculateMax("fp");
  }

  override prepareDerivedData() {
    super.prepareDerivedData();
    const data = this._systemData;

    // Do items here, before everything else

    const tn = data.tn;
    const tnBoostMod = data.tnBoosts * 20;

    const accuracyBuff = data.buffs.sukukaja - data.buffs.sukunda;

    tn.st = Math.max(tn.st + accuracyBuff + tnBoostMod, 1);
    tn.ma = Math.max(tn.ma + accuracyBuff + tnBoostMod, 1);
    tn.ag = Math.max(tn.ag + accuracyBuff + tnBoostMod, 1);

    tn.phys = Math.max(tn.phys + accuracyBuff + tnBoostMod, 1);
    tn.mag = Math.max(tn.mag + accuracyBuff + tnBoostMod, 1);
    tn.dodge = Math.max(tn.dodge + accuracyBuff + tnBoostMod, 1);
    tn.gun = Math.max(tn.gun + accuracyBuff + tnBoostMod, 1);

    // Apply buff modifiers to power and resist
    const physAtkBuff = data.buffs.tarukaja - data.buffs.tarunda;
    const magAtkBuff = data.buffs.makakaja - data.buffs.tarunda;
    const resistBuff = data.buffs.rakukaja - data.buffs.rakunda;

    data.power.phys = Math.max(data.power.phys + physAtkBuff, 0);
    data.power.gun = Math.max(data.power.gun + physAtkBuff, 0);
    data.power.mag = Math.max(data.power.mag + magAtkBuff, 0);

    data.resist.phys = Math.max(data.resist.phys + resistBuff, 0);
    data.resist.mag = Math.max(data.resist.mag + resistBuff, 0);
  }

  calculateMax(resourceType: ResourceType) {
    const data = this._systemData;
    const stats = data.stats;
    switch (resourceType) {
      case "hp":
        return Math.max((stats.vi.value + this.lv) * data.hpMultiplier, 1);
      case "mp":
        return Math.max((stats.ma.value + this.lv) * data.mpMultiplier, 1);
      case "fp":
        return Math.floor(stats.lu.value / 5) + 5;
      default:
        resourceType satisfies never;
    }

    throw new Error("Invalid resource type");
  }

  #preparePassiveEffects() {
    const data = this._systemData;
    const items = this.actor.items;

    const modNames = ["might", "luckyFind"] as const;

    // @ts-expect-error This isn't readonly(?)
    data.mods = Object.fromEntries(
      modNames.map((name) => [
        name,
        Boolean(items.find((item) => item.system.passiveMods.mods[name])),
      ]),
    );

    // @ts-expect-error This isn't readonly
    data.hpMultiplier += [...items.values()].reduce(
      (prev, curr) => prev + curr.system.passiveMods.hpMultiplier,
      0,
    );

    // @ts-expect-error This isn't readonly
    data.mpMultiplier = [...items.values()].reduce(
      (prev, curr) => prev + curr.system.passiveMods.mpMultiplier,
      0,
    );

    const elementBoostTypes = ["fire", "cold", "elec", "force"] as const;

    // @ts-expect-error This isn't readonly(?)
    data.elementBoost = Object.fromEntries(
      elementBoostTypes.map((element) => [
        element,
        [...items.values()].reduce(
          (hasBoost, item) =>
            hasBoost || item.system.passiveMods.elementBoost[element],
          false,
        ),
      ]),
    );

    const powerBoostTypes = ["phys", "mag", "item"] as const;

    // @ts-expect-error This isn't readonly(?)
    data.powerBoost = Object.fromEntries(
      powerBoostTypes.map((boost) => [
        boost,
        [...items.values()].reduce(
          (hasBoost, item) =>
            hasBoost || item.system.passiveMods.powerBoost[boost],
          false,
        ),
      ]),
    );

    const tnModTypes = ["dodge", "gun"] as const;

    // @ts-expect-error This isn't readonly(?)
    data.tn = Object.fromEntries(
      tnModTypes.map((modType) => [
        modType,
        [...items.values()].reduce(
          (mod, item) => mod + item.system.passiveMods.tn[modType],
          0,
        ),
      ]),
    );
  }

  get st(): number {
    const data = this._systemData;
    return data.stats.st.value;
  }

  get ma(): number {
    const data = this._systemData;
    return data.stats.ma.value;
  }

  get vi(): number {
    const data = this._systemData;
    return data.stats.vi.value;
  }

  get ag(): number {
    const data = this._systemData;
    return data.stats.ag.value;
  }

  get lu(): number {
    const data = this._systemData;
    return data.stats.lu.value;
  }

  #getBaseResist(damageType: DamageType, option: ResistCalcOption) {
    const data = this._systemData;
    const stats = data.stats;
    const lv = data.lv;

    switch (option) {
      case "raw": {
        const stat = damageType === "phys" ? "vi" : "ma";
        return Math.max(Math.floor((stats[stat].value + lv) / 2), 0);
      }
      case "opt1": {
        const stat = damageType === "phys" ? "st" : "vi";
        return Math.max(Math.floor((stats[stat].value + lv) / 2), 0);
      }
      case "opt2": {
        const stat = damageType === "phys" ? "st" : "ma";
        return Math.max(
          Math.floor((stats[stat].value + stats.vi.value + lv) / 2),
          0,
        );
      }
      case "opt3": {
        const stat = damageType === "phys" ? "st" : "ma";
        return Math.max(stats[stat].value + stats.vi.value + lv, 0);
      }
      default:
        option satisfies never;
    }

    throw new Error("Invalid resist option");
  }

  // Typescript hack
  get _systemData() {
    return this as this & Subtype<SmtActor, this["type"]>["system"];
  }
}

function generateStatSchema() {
  const fields = foundry.data.fields;

  return {
    base: new fields.NumberField({ integer: true, initial: 1, min: 1 }),
    lv: new fields.NumberField({ integer: true, min: 0 }),
    mgt: new fields.NumberField({ integer: true, min: 0 }),
    value: new fields.NumberField({ integer: true, min: 1 }),
  };
}
