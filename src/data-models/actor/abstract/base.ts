import { SmtActor } from "../../../documents/actor/actor.js";
import baseSchemaFields from "./base-schema-fields.js";

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

  readonly autoFailThreshold = 96;

  get equippedMagatama() {
    // Return `undefined` if this isn't a Fiend
    const actor = this.parent as SmtActor;

    return actor.items.find(
      (item) => item.type === "magatama" && item.system.equipped,
    );
  }

  static override defineSchema() {
    return {
      ...baseSchemaFields(),
    } as const;
  }

  override prepareBaseData() {
    super.prepareBaseData();
    const data = this._systemData;

    // @ts-expect-error This isn't readonly
    data.hpMultiplier = 6;
    // @ts-expect-error This isn't readonly
    data.mpMultiplier = 4;

    // Calculate stat values
    const stats = data.stats;

    for (const [key, stat] of Object.entries(stats)) {
      const statName = key as keyof typeof data.stats;
      const mgt = data.equippedMagatama?.system.stats[statName] ?? 0;
      stat.value = Math.max(stat.base + stat.lv + mgt, 1);
    }

    const lv = data.lv;

    data.resist.phys = Math.max((stats.vi.value + lv) / 2, 0);
    data.resist.mag = Math.max((stats.ma.value + lv) / 2, 0);

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
      const tn = stat.value * 5 + lv + tnBoostMod;
      data.tn[statName] = Math.max(Math.floor(tn / data.multi), 1);
    });

    // Set derived TNs
    data.tn.save = data.tn.vi;
    data.tn.dodge = stats.ag.value + 10;
    data.tn.negotiation = stats.lu.value * 2 + 20;

    // Calculate HP/MP/FP max
    data.hp.max = Math.max((stats.vi.value + lv) * data.hpMultiplier, 1);
    data.mp.max = Math.max((stats.ma.value + lv) * data.mpMultiplier, 1);
    data.fp.max = Math.floor(stats.lu.value / 5) + 5;
  }

  // Goofy Typescript hack
  protected get _systemData() {
    return this as this & Subtype<SmtActor, this["type"]>["system"];
  }
}
