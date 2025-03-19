export function configureStatusEffects() {
  CONFIG.statusEffects = [...ailmentData, ...miscStatuses];
  CONFIG.specialStatusEffects.FLY = "liftoma";
}

declare global {
  type AilmentStatusId = (typeof ailmentData)[number]["id"];
  type MiscStatusId = (typeof miscStatuses)[number]["id"];
  type StatusId = AilmentStatusId | MiscStatusId;

  interface PriorityAilment {
    id: AilmentStatusId;
    name: string;
    img: string;
    priority: number;
  }
}

const { ADD, OVERRIDE } = CONST.ACTIVE_EFFECT_MODES;

export const ailmentData = [
  {
    id: "dead",
    name: "SMT.ailments.dead",
    img: "icons/svg/skull.svg",
    priority: 0,
  },
  {
    id: "stone",
    name: "SMT.ailments.stone",
    img: "icons/svg/statue.svg",
    priority: 1,
  },
  {
    id: "fly",
    name: "SMT.ailments.fly",
    img: "icons/svg/card-joker.svg",
    priority: 2,
    changes: [
      {
        key: "system.stats.st.value",
        value: "1",
        mode: OVERRIDE,
      },
      {
        key: "system.stats.ma.value",
        value: "1",
        mode: OVERRIDE,
      },
      {
        key: "system.stats.vi.value",
        value: "1",
        mode: OVERRIDE,
      },
      {
        key: "system.stats.lu.value",
        value: "1",
        mode: OVERRIDE,
      },
    ],
  },
  {
    id: "stun",
    name: "SMT.ailments.stun",
    img: "icons/svg/paralysis.svg",
    priority: 3,
  },
  {
    id: "charm",
    name: "SMT.ailments.charm",
    img: "icons/svg/stoned.svg",
    priority: 4,
  },
  {
    id: "poison",
    name: "SMT.ailments.poison",
    img: "icons/svg/poison.svg",
    priority: 5,
  },
  {
    id: "mute",
    name: "SMT.ailments.mute",
    img: "icons/svg/silenced.svg",
    priority: 6,
  },
  {
    id: "restrain",
    name: "SMT.ailments.restrain",
    img: "icons/svg/net.svg",
    priority: 7,
  },
  {
    id: "freeze",
    name: "SMT.ailments.freeze",
    img: "icons/svg/frozen.svg",
    priority: 8,
  },
  {
    id: "sleep",
    name: "SMT.ailments.sleep",
    img: "icons/svg/sleep.svg",
    priority: 9,
  },
  {
    id: "panic",
    name: "SMT.ailments.panic",
    img: "icons/svg/daze.svg",
    priority: 10,
  },
  {
    id: "shock",
    name: "SMT.ailments.shock",
    img: "icons/svg/lightning.svg",
    priority: 11,
  },
] as const;

const miscStatuses = [
  {
    id: "tarukaja",
    name: "SMT.buffs.tarukaja",
    img: "icons/svg/sword.svg",
  },
  {
    id: "rakukaja",
    name: "SMT.buffs.rakukaja",
    img: "icons/svg/shield.svg",
  },
  {
    id: "sukukaja",
    name: "SMT.buffs.sukukaja",
    img: "icons/svg/wingfoot.svg",
  },
  {
    id: "makakaja",
    name: "SMT.buffs.makakaja",
    img: "icons/svg/explosion.svg",
  },
  {
    id: "tarunda",
    name: "SMT.buffs.tarunda",
    img: "icons/svg/downgrade.svg",
  },
  {
    id: "rakunda",
    name: "SMT.buffs.rakunda",
    img: "icons/svg/ruins.svg",
  },
  {
    id: "sukunda",
    name: "SMT.buffs.sukunda",
    img: "icons/svg/trap.svg",
  },
  {
    id: "defending",
    name: "SMT.statusEffects.defending",
    img: "icons/svg/tower.svg",
    changes: [
      {
        key: "system.tn.dodge",
        value: "20",
        mode: ADD,
      },
    ],
  },
  {
    id: "focus",
    name: "SMT.statusEffects.focus",
    img: "icons/svg/aura.svg",
  },
  {
    id: "liftoma",
    name: "SMT.statusEffects.liftoma",
    img: "icons/svg/angel.svg",
  },
  {
    id: "lightoma",
    name: "SMT.statusEffects.lightoma",
    img: "icons/svg/light.svg",
  },
  {
    id: "tetraja",
    name: "SMT.statusEffects.tetraja",
    img: "icons/svg/holy-shield.svg",
  },
  {
    id: "makarakarn",
    name: "SMT.statusEffects.makarakarn",
    img: "icons/svg/mage-shield.svg",
  },
  {
    id: "tetrakarn",
    name: "SMT.statusEffects.tetrakarn",
    img: "icons/svg/combat.svg",
  },
  {
    id: "estoma",
    name: "SMT.statusEffects.estoma",
    img: "icons/svg/invisible.svg",
  },
  {
    id: "riberama",
    name: "SMT.statusEffects.riberama",
    img: "icons/svg/target.svg",
  },
  {
    id: "curse",
    name: "SMT.ailments.curse",
    img: "icons/svg/eye.svg",
  },
] as const;
