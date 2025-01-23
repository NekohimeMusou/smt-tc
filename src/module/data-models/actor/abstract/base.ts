import { SmtActor } from "../../../document/actor/actor.js";
import affinityFields from "../../shared/affinities.js";

export abstract class SmtBaseActorData extends foundry.abstract.TypeDataModel {
  abstract readonly type: CharacterClass;

  get lv(): number {
    const data = this._systemData;
    const levelTable = CONFIG.SMT.levelTables[this.type];

    return Math.max(
      levelTable.findLastIndex((xp) => xp < data.xp),
      1,
    );
  }

  get autoFailThreshold() {
    const actor = this.parent as SmtActor;

    if (actor.statuses.has("stun")) {
      return 26;
    }

    if (actor.statuses.has("curse")) {
      return 86;
    }

    return 96;
  }

  // Status condition modifiers
  get ignorePhysAffinity() {
    const actor = this.parent as SmtActor;

    return actor.statuses.has("freeze");
  }

  get physAttacksCrit() {
    const actor = this.parent as SmtActor;

    for (const status of ["shock", "freeze", "restrain"]) {
      if (actor.statuses.has(status)) {
        return true;
      }
    }

    return false;
  }

  get noActions() {
    const actor = this.parent as SmtActor;

    for (const status of ["restrain", "freeze", "sleep", "shock"]) {
      if (actor.statuses.has(status)) {
        return true;
      }
    }

    return false;
  }

  get mute() {
    const actor = this.parent as SmtActor;

    return actor.statuses.has("mute");
  }

  get poisoned() {
    const actor = this.parent as SmtActor;

    return actor.statuses.has("poison");
  }

  get stone() {
    const actor = this.parent as SmtActor;

    return actor.statuses.has("stone");
  }

  get takeDoubleDamage() {
    const actor = this.parent as SmtActor;

    return actor.statuses.has("flied");
  }

  get focused() {
    const actor = this.parent as SmtActor;

    return actor.statuses.has("focused");
  }

  static override defineSchema() {
    const fields = foundry.data.fields;

    const tn = new fields.SchemaField({
      st: new fields.NumberField({ integer: true }),
      ma: new fields.NumberField({ integer: true }),
      vi: new fields.NumberField({ integer: true }),
      ag: new fields.NumberField({ integer: true }),
      lu: new fields.NumberField({ integer: true }),
      save: new fields.NumberField({ integer: true }),
      dodge: new fields.NumberField({ integer: true }),
      negotiation: new fields.NumberField({ integer: true }),
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

    // Targets for active effects/equipment
    const modifiers = {
      gunAttackBonus: new fields.NumberField({ integer: true }),
      dodgeBonus: new fields.NumberField({ integer: true }),
      resistBonus: new fields.SchemaField({
        phys: new fields.NumberField({ integer: true, initial: 0 }),
        mag: new fields.NumberField({ integer: true, initial: 0 }),
      }),
      might: new fields.BooleanField(),
      pierce: new fields.BooleanField(),
      powerBoost: new fields.SchemaField({
        phys: new fields.BooleanField(),
        mag: new fields.BooleanField(),
        item: new fields.BooleanField(),
      }),
      elementBoost: new fields.SchemaField({
        fire: new fields.BooleanField(),
        cold: new fields.BooleanField(),
        elec: new fields.BooleanField(),
        force: new fields.BooleanField(),
      }),
      resourceBoost: new fields.SchemaField({
        hp: new fields.NumberField({ integer: true, min: 0, initial: 0 }),
        mp: new fields.NumberField({ integer: true, min: 0, initial: 0 }),
      }),
      buffs: new fields.SchemaField({
        physPower: new fields.NumberField({ integer: true, min: 0 }),
        magPower: new fields.NumberField({ integer: true, min: 0 }),
        accuracy: new fields.NumberField({ integer: true, min: 0 }),
        resist: new fields.NumberField({ integer: true, min: 0 }),
      }),
      debuffs: new fields.SchemaField({
        physPower: new fields.NumberField({ integer: true, min: 0 }),
        magPower: new fields.NumberField({ integer: true, min: 0 }),
        accuracy: new fields.NumberField({ integer: true, min: 0 }),
        resist: new fields.NumberField({ integer: true, min: 0 }),
      }),
    };

    return {
      ...super.defineSchema(),
      notes: new fields.HTMLField(),
      xp: new fields.NumberField({ integer: true, min: 0 }),
      macca: new fields.NumberField({ integer: true, min: 0 }),
      affinities: new fields.SchemaField(affinityFields()),
      hpMultiplier: new fields.NumberField({ integer: true, min: 0 }),
      mpMultiplier: new fields.NumberField({ integer: true, min: 0 }),
      tnBoosts: new fields.NumberField({ integer: true, initial: 0 }), // +/- 20 TN bonuses from the sheet
      multi: new fields.NumberField({
        integer: true,
        initial: 1,
        positive: true,
        max: 3,
      }),
      stats: new fields.SchemaField({
        st: new fields.SchemaField(generateStatSchema()),
        ma: new fields.SchemaField(generateStatSchema()),
        vi: new fields.SchemaField(generateStatSchema()),
        ag: new fields.SchemaField(generateStatSchema()),
        lu: new fields.SchemaField(generateStatSchema()),
      }),
      tn,
      power,
      resist,
      ...resources,
      ...modifiers,
    };
  }

  override prepareBaseData() {
    super.prepareBaseData();
    const data = this._systemData;

    // @ts-expect-error This isn't readonly
    data.hpMultiplier = data.type === "human" ? 4 : 6;
    // @ts-expect-error This isn't readonly
    data.mpMultiplier = data.type === "human" ? 2 : 3;

    const stats = data.stats;

    for (const stat of Object.values(stats)) {
      stat.value = Math.max(stat.base + stat.lv, 1);
    }

    const lv = this.lv;

    data.resist.phys = Math.max(
      Math.floor((stats.vi.value + lv) / 2) +
        data.buffs.resist -
        data.debuffs.resist +
        data.resistBonus.phys,
      0,
    );
    data.resist.mag = Math.max(
      Math.floor((stats.ma.value + lv) / 2) +
        data.buffs.resist -
        data.debuffs.resist +
        data.resistBonus.mag,
      0,
    );

    // Calculate power and resistance
    data.power.phys = Math.max(
      stats.st.value + lv + data.buffs.physPower - data.debuffs.physPower,
      0,
    );
    data.power.mag = Math.max(
      stats.ma.value + lv + data.buffs.magPower - data.debuffs.magPower,
      0,
    );
    data.power.gun = Math.max(
      stats.ag.value + data.buffs.physPower - data.debuffs.physPower,
      0,
    );
  }

  protected get _systemData() {
    return this as this & Subtype<SmtActor, this["type"]>["system"];
  }
}

function generateStatSchema() {
  const fields = foundry.data.fields;

  return {
    base: new fields.NumberField({ integer: true, initial: 1, min: 1 }),
    lv: new fields.NumberField({ integer: true, min: 0 }),
    value: new fields.NumberField({ integer: true, min: 1 }),
  };
}
