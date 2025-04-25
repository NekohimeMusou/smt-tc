import { SMT } from "../../../config/config.js";
import SmtActor from "../../../documents/actor/actor.js";
import { Magatama } from "../../../documents/item/item.js";
import DefenseAffinityData from "../../embedded/defense-affinities.js";

interface ReasonEndorsement {
  name: string;
  value: number;
}

export default abstract class SmtBaseActorData extends foundry.abstract.TypeDataModel {
  abstract override readonly type: CharacterClass;

  get actor() {
    return this.parent as SmtActor;
  }

  get lv(): number {
    const data = this._systemData;

    if (data.overrides.lv.toggle) {
      return data.overrides.lv.value;
    }

    return this.#levelByXP;
  }

  get #levelByXP(): number {
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

  get canUseItems() {
    return this.type !== "demon";
  }

  static override migrateData(source: Record<string, unknown>) {
    // TODO: Toggle on the checkboxes if isNPC was true
    if ("isNPC" in source) {
      delete source.isNPC;
    }

    if ("levelOverride" in source) {
      foundry.utils.mergeObject(source, {
        overrides: {
          lv: {
            value: source.levelOverride,
          },
        },
      });

      delete source.levelOverride;
    }

    const resourceOverrides: [ResourceType, { value: unknown }][] = [];

    for (const resource of Object.keys(
      CONFIG.SMT.resourceTypes,
    ) as ResourceType[]) {
      if (
        resource in source &&
        source[resource] instanceof Object &&
        "override" in source[resource]
      ) {
        resourceOverrides.push([
          resource,
          { value: source[resource].override },
        ]);
        delete source[resource].override;
      }
    }

    foundry.utils.mergeObject(source, {
      overrides: Object.fromEntries(resourceOverrides),
    });

    return super.migrateData(source);
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
      }),
      mp: new fields.SchemaField({
        max: new fields.NumberField({ integer: true }),
        value: new fields.NumberField({ integer: true }),
      }),
      fp: new fields.SchemaField({
        max: new fields.NumberField({ integer: true }),
        value: new fields.NumberField({ integer: true }),
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
      endorsements: new fields.ArrayField(
        new fields.ObjectField<ReasonEndorsement>(),
        {
          initial: Object.values(SMT.defaultReasons).map((locName) => ({
            name: game.i18n.localize(locName),
            value: 0,
          })),
        },
      ),
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

    const overrides = new fields.SchemaField({
      lv: new fields.SchemaField({
        toggle: new fields.BooleanField(),
        value: new fields.NumberField({ integer: true, min: 0 }),
      }),
      hp: new fields.SchemaField({
        toggle: new fields.BooleanField(),
        value: new fields.NumberField({ integer: true, min: 0 }),
      }),
      mp: new fields.SchemaField({
        toggle: new fields.BooleanField(),
        value: new fields.NumberField({ integer: true, min: 0 }),
      }),
      fp: new fields.SchemaField({
        toggle: new fields.BooleanField(),
        value: new fields.NumberField({ integer: true, min: 0 }),
      }),
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
      overrides,
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
    } as const;
  }

  override prepareBaseData() {
    super.prepareBaseData();
    const data = this._systemData;
    const actor = this.actor;

    // @ts-expect-error This isn't readonly
    data.hpMultiplier = actor.type === "human" ? 4 : 6;
    // @ts-expect-error This isn't readonly
    data.mpMultiplier = actor.type === "human" ? 2 : 3;

    // Calculate stat values
    const stats = data.stats;

    for (const [key, stat] of Object.entries(stats)) {
      // Fiends always have 2 for their base stats
      if (actor.type === "fiend") {
        stat.base = 2;
      }
      const statName = key as keyof typeof data.stats;
      const mgt = data.equippedMagatama?.system.stats[statName] ?? 0;
      stat.value = Math.clamp(stat.base + stat.lv + mgt, 1, 40);
    }

    const lv = data.lv;

    // Set derived TNs
    // Maybe find a better way to support AEs modifying these
    data.tn.phys = 0;
    data.tn.mag = 0;
    data.tn.save = 0;
    data.tn.dodge = 0;
    data.tn.negotiation = 0;
    data.tn.gun = 0;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const physResistFormulaChoice = game.settings.get(
      "smt-tc",
      "alternatePhysResistCalc",
    ) as ResistCalcOption;

    let basePhysResist = 0;

    switch (physResistFormulaChoice) {
      case "raw":
        basePhysResist = Math.floor((stats.vi.value + lv) / 2);
        break;
      case "opt1":
        basePhysResist = Math.floor((stats.st.value + lv) / 2);
        break;
      case "opt2":
        basePhysResist = Math.floor((stats.st.value + stats.vi.value + lv) / 2);
        break;
      case "opt3":
        basePhysResist = Math.floor(stats.st.value + stats.vi.value + lv);
        break;
      default:
        physResistFormulaChoice satisfies never;
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const magResistFormulaChoice = game.settings.get(
      "smt-tc",
      "alternateMagResistCalc",
    ) as ResistCalcOption;

    let baseMagResist = 0;

    switch (magResistFormulaChoice) {
      case "raw":
        baseMagResist = Math.floor((stats.ma.value + lv) / 2);
        break;
      case "opt1":
        baseMagResist = Math.floor((stats.vi.value + lv) / 2);
        break;
      case "opt2":
        baseMagResist = Math.floor((stats.ma.value + stats.vi.value + lv) / 2);
        break;
      case "opt3":
        baseMagResist = Math.floor(stats.ma.value + stats.vi.value + lv);
        break;
      default:
        magResistFormulaChoice satisfies never;
    }

    data.resist.phys = Math.max(basePhysResist, 0);
    data.resist.mag = Math.max(baseMagResist, 0);

    const addLevelToGunDamage = game.settings.get(
      "smt-tc",
      "addLevelToGunDamage",
    );

    const gunLvMod = addLevelToGunDamage ? lv : 0;

    data.power.phys = Math.max(stats.st.value + lv, 0);
    data.power.mag = Math.max(stats.ma.value + lv, 0);
    data.power.gun = Math.max(stats.ag.value + gunLvMod, 0);
  }

  override prepareDerivedData() {
    const data = this._systemData;

    // Set base TNs
    const stats = data.stats;
    const tnBoostMod = data.tnBoosts * 20;
    const lv = data.lv;

    Object.entries(stats).forEach(([key, stat]) => {
      const statName = key as keyof typeof stats;
      data.tn[statName] = Math.max(stat.value * 5 + lv + tnBoostMod, 1);
    });

    const accuracyBuff = data.buffs.sukukaja - data.buffs.sukunda;

    data.tn.phys += data.tn.st + accuracyBuff;
    data.tn.mag += data.tn.ma + accuracyBuff;
    data.tn.save += data.tn.vi;
    data.tn.dodge += stats.ag.value + 10 + tnBoostMod + accuracyBuff;
    data.tn.negotiation += stats.lu.value * 2 + 20;
    data.tn.gun += data.tn.ag + accuracyBuff;

    // NOW apply multi-attack
    for (const tnName of Object.keys(data.tn)) {
      const tn = tnName as keyof typeof data.tn;
      data.tn[tn] = Math.floor(data.tn[tn] / data.multi);
    }

    // Apply buff modifiers
    const physAtkBuff = data.buffs.tarukaja - data.buffs.tarunda;
    const magAtkBuff = data.buffs.makakaja - data.buffs.tarunda;
    const resistBuff = data.buffs.rakukaja - data.buffs.rakunda;

    data.power.phys = Math.max(data.power.phys + physAtkBuff, 0);
    data.power.gun = Math.max(data.power.gun + physAtkBuff, 0);
    data.power.mag = Math.max(data.power.mag + magAtkBuff, 0);

    data.resist.phys = Math.max(data.resist.phys + resistBuff, 0);
    data.resist.mag = Math.max(data.resist.mag + resistBuff, 0);

    // Calculate HP/MP/FP max
    const overrides = data.overrides;

    (Object.keys(CONFIG.SMT.resourceTypes) as ResourceType[]).forEach(
      (resource) => {
        data[resource].max = overrides[resource].toggle
          ? overrides[resource].value
          : this.calculateMax(resource);
      },
    );
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

  // Goofy Typescript hack
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
