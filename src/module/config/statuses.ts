export function configureStatusEffects() {
  CONFIG.statusEffects = [...ailments, ...miscStatuses];
  CONFIG.specialStatusEffects.FLY = "liftoma";
}

declare global {
  export type AilmentStatusId = (typeof ailments)[number]["id"];
  export type MiscStatusId = (typeof miscStatuses)[number]["id"];
  export type StatusId = AilmentStatusId | MiscStatusId;
}

const { ADD, OVERRIDE } = CONST.ACTIVE_EFFECT_MODES;

export const ailments = [
  {
    id: "dead",
    name: "SMT.ailments.dead",
    icon: "icons/svg/skull.svg",
    priority: 0,
  },
  {
    id: "stone",
    name: "SMT.ailments.stone",
    icon: "icons/svg/statue.svg",
    priority: 1,
  },
  {
    id: "fly",
    name: "SMT.ailments.fly",
    icon: "icons/svg/card-joker.svg",
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
    icon: "icons/svg/daze.svg",
    priority: 3,
  },
  {
    id: "charm",
    name: "SMT.ailments.charm",
    icon: "icons/svg/stoned.svg",
    priority: 4,
  },
  {
    id: "poison",
    name: "SMT.ailments.poison",
    icon: "icons/svg/poison.svg",
    priority: 5,
  },
  {
    id: "mute",
    name: "SMT.ailments.mute",
    icon: "icons/svg/silenced.svg",
    priority: 6,
  },
  {
    id: "restrain",
    name: "SMT.ailments.restrain",
    icon: "icons/svg/net.svg",
    priority: 7,
  },
  {
    id: "freeze",
    name: "SMT.ailments.freeze",
    icon: "icons/svg/frozen.svg",
    priority: 8,
  },
  {
    id: "sleep",
    name: "SMT.ailments.sleep",
    icon: "icons/svg/sleep.svg",
    priority: 9,
  },
  {
    id: "panic",
    name: "SMT.ailments.panic",
    icon: "icons/svg/terror.svg",
    priority: 10,
  },
  {
    id: "shock",
    name: "SMT.ailments.shock",
    icon: "icons/svg/lightning.svg",
    priority: 11,
  },
  {
    id: "curse",
    name: "SMT.ailments.curse",
    icon: "icons/svg/eye.svg",
  },
] as const;

const miscStatuses = [
  {
    id: "tarukaja",
    name: "SMT.buffs.tarukaja",
    icon: "icons/svg/sword.svg",
  },
  {
    id: "rakukaja",
    name: "SMT.buffs.rakukaja",
    icon: "icons/svg/shield.svg",
  },
  {
    id: "sukukaja",
    name: "SMT.buffs.sukukaja",
    icon: "icons/svg/wingfoot.svg",
  },
  {
    id: "makakaja",
    name: "SMT.buffs.makakaja",
    icon: "icons/svg/explosion.svg",
  },
  {
    id: "tarunda",
    name: "SMT.buffs.tarunda",
    icon: "icons/svg/downgrade.svg",
  },
  {
    id: "rakunda",
    name: "SMT.buffs.rakunda",
    icon: "icons/svg/ruins.svg",
  },
  {
    id: "sukunda",
    name: "SMT.buffs.sukunda",
    icon: "icons/svg/trap.svg",
  },
  {
    id: "defending",
    name: "SMT.statusEffects.defending",
    icon: "icons/svg/combat.svg",
    changes: [
      {
        key: "system.tn.dodge",
        value: "20",
        mode: ADD,
      },
    ],
  },
  {
    id: "focused",
    name: "SMT.statusEffects.focused",
    icon: "icons/svg/aura.svg",
  },
  {
    id: "liftoma",
    name: "SMT.statusEffects.liftoma",
    icon: "icons/svg/wing.svg",
  },
] as const;
