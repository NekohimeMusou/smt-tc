import affinityFields from "../../shared/affinities.js";

export abstract class SmtBaseActorModel extends foundry.abstract.TypeDataModel {
  abstract get charClass(): CharacterClass;

  abstract get level(): number;
  abstract get autoFailThreshold(): number;

  // Status condition modifiers
  abstract get ignorePhysAffinity(): boolean;
  abstract get physAttacksCrit(): boolean;
  abstract get noActions(): boolean;
  abstract get mute(): boolean;
  abstract get poison(): boolean;
  abstract get takeDoubleDamage(): boolean;
  abstract get stone(): boolean;

  static override defineSchema() {
    const fields = foundry.data.fields;

    const stats = new fields.SchemaField({
      st: new fields.SchemaField(generateStatSchema()),
      ma: new fields.SchemaField(generateStatSchema()),
      vi: new fields.SchemaField(generateStatSchema()),
      ag: new fields.SchemaField(generateStatSchema()),
      lu: new fields.SchemaField(generateStatSchema()),
    });

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
      focused: new fields.BooleanField({ initial: false }),
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
      stats,
      tn,
      power,
      resist,
      ...resources,
      ...modifiers,
    };
  }
}

function generateStatSchema() {
  const fields = foundry.data.fields;

  return {
    base: new fields.NumberField({ integer: true, initial: 1 }),
    magatama: new fields.NumberField({ integer: true }),
    lv: new fields.NumberField({ integer: true }),
    value: new fields.NumberField({ integer: true }),
  };
}
