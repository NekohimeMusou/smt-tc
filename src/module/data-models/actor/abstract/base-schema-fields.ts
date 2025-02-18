import { DefenseAffinityData } from "../../defense-affinities.js";

const fields = foundry.data.fields;

const stats = new fields.SchemaField({
  st: new fields.SchemaField({
    ...generateStatSchema(),
    derivedTN: new fields.StringField({ initial: "physAtk" }),
  }),
  ma: new fields.SchemaField({
    ...generateStatSchema(),
    derivedTN: new fields.StringField({ initial: "magAtk" }),
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

function generateStatSchema() {
  const fields = foundry.data.fields;

  return {
    base: new fields.NumberField({ integer: true, initial: 1, min: 1 }),
    lv: new fields.NumberField({ integer: true, min: 0 }),
    mgt: new fields.NumberField({ integer: true, min: 0 }),
    value: new fields.NumberField({ integer: true, min: 1 }),
  };
}

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
  physAtk: new fields.NumberField({ integer: true }),
  magAtk: new fields.NumberField({ integer: true }),
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

const bioData = {
  notes: new fields.HTMLField(),
  backgrounds: new fields.ArrayField(new fields.StringField()),
  contacts: new fields.ArrayField(new fields.StringField()),
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
  personality: new fields.StringField(),
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
  tarukaja: new fields.NumberField({ integer: true, min: 0 }),
  makakaja: new fields.NumberField({ integer: true, min: 0 }),
  rakukaja: new fields.NumberField({ integer: true, min: 0 }),
  sukukaja: new fields.NumberField({ integer: true, min: 0 }),
  tarunda: new fields.NumberField({ integer: true, min: 0 }),
  rakunda: new fields.NumberField({ integer: true, min: 0 }),
  sukunda: new fields.NumberField({ integer: true, min: 0 }),
});
// Modifiers for AEs etc to latch onto
const mods = new fields.SchemaField({
  might: new fields.BooleanField(),
});

const powerBoost = new fields.SchemaField({
  phys: new fields.BooleanField(),
  mag: new fields.BooleanField(),
  item: new fields.BooleanField(),
});

export default function baseSchemaFields() {
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
    hpMultiplier: new fields.NumberField({ integer: true, positive: true }),
    mpMultiplier: new fields.NumberField({ integer: true, positive: true }),
    xp: new fields.NumberField({ integer: true, min: 0 }),
    macca: new fields.NumberField({ integer: true, min: 0 }),
    affinities: new fields.EmbeddedDataField(DefenseAffinityData),
    // Should this be considered an NPC for e.g. Auto Dodge
    npc: new fields.BooleanField(),
  };
}
