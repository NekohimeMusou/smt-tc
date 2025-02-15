declare global {
  type StatusId = (typeof smtStatuses)[number]["id"];
}

type StatusLocObject = Record<StatusId, (typeof smtStatuses)[number]["name"]>;

export function configureStatusEffects() {
  CONFIG.statusEffects = smtStatuses;
}

const { ADD, OVERRIDE } = CONST.ACTIVE_EFFECT_MODES;

const smtStatuses = [
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
    id: "flied",
    name: "SMT.ailments.flied",
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
  {
    id: "tarukaja",
    name: "SMT.buffSpells.tarukaja",
    icon: "icons/svg/sword.svg",
  },
  {
    id: "rakukaja",
    name: "SMT.buffSpells.rakukaja",
    icon: "icons/svg/shield.svg",
  },
  {
    id: "sukukaja",
    name: "SMT.buffSpells.sukukaja",
    icon: "icons/svg/wingfoot.svg",
  },
  {
    id: "makakaja",
    name: "SMT.buffSpells.makakaja",
    icon: "icons/svg/explosion.svg",
  },
  {
    id: "tarunda",
    name: "SMT.debuffSpells.tarunda",
    icon: "icons/svg/downgrade.svg",
  },
  {
    id: "rakunda",
    name: "SMT.debuffSpells.rakunda",
    icon: "icons/svg/ruins.svg",
  },
  {
    id: "sukunda",
    name: "SMT.debuffSpells.sukunda",
    icon: "icons/svg/trap.svg",
  },
  {
    id: "defending",
    name: "SMT.characterMods.defending",
    icon: "icons/svg/combat.svg",
    changes: [
      {
        key: "system.dodgeBonus",
        value: "20",
        mode: ADD,
      },
    ],
  },
  {
    id: "focused",
    name: "SMT.characterMods.focused",
    icon: "icons/svg/aura.svg",
  },
] as const;

export const statusEffects = Object.fromEntries(
  smtStatuses.map(({ id, name }) => [id, name]),
) as StatusLocObject;
