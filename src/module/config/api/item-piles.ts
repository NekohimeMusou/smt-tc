declare global {
  interface Game {
    itempiles: { API: { addSystemIntegration: (a: object) => Promise<void> } };
  }

  interface HOOKS {
    "item-piles-ready": () => Promise<void>;
  }
}

export default async function _onItemPilesReady() {
  await game.itempiles.API.addSystemIntegration({
    VERSION: `${game.system.version}`,
    ACTOR_CLASS_TYPE: "human",
    ITEM_QUANTITY_ATTRIBUTE: "system.qty",
    ITEM_PRICE_ATTRIBUTE: "system.price",
    ITEM_FILTERS: [{ path: "type", filters: "skill" }],
    UNSTACKABLE_ITEM_TYPES: ["weapon", "armor", "magatama"],
    ITEM_SIMILARITIES: ["name", "type"],
    CURRENCY_DECIMAL_DIGITS: 1,
    CURRENCIES: [
      {
        name: "Macca",
        primary: true,
        type: "attribute",
        img: "icons/commodities/currency/coin-yingyang.webp",
        abbreviation: "{#}mc",
        data: { path: "system.macca" },
        exchangeRate: 1,
      },
    ],
    SECONDARY_CURRENCIES: [
      {
        name: "Diamond",
        type: "attribute",
        img: CONFIG.SMT.gemIcons.diamond,
        abbreviation: `{#} ${game.i18n.localize("SMT.gems.diamond.name")}`,
        data: {
          path: "system.gems.diamond",
        },
      },
      {
        name: "Pearl",
        type: "attribute",
        img: CONFIG.SMT.gemIcons.pearl,
        abbreviation: `{#} ${game.i18n.localize("SMT.gems.pearl.name")}`,
        data: {
          path: "system.gems.pearl",
        },
      },
      {
        name: "Sapphire",
        type: "attribute",
        img: CONFIG.SMT.gemIcons.sapphire,
        abbreviation: `{#} ${game.i18n.localize("SMT.gems.sapphire.name")}`,
        data: {
          path: "system.gems.sapphire",
        },
      },
      {
        name: "Emerald",
        type: "attribute",
        img: CONFIG.SMT.gemIcons.emerald,
        abbreviation: `{#} ${game.i18n.localize("SMT.gems.emerald.name")}`,
        data: {
          path: "system.gems.emerald",
        },
      },
      {
        name: "Ruby",
        type: "attribute",
        img: CONFIG.SMT.gemIcons.ruby,
        abbreviation: `{#} ${game.i18n.localize("SMT.gems.ruby.name")}`,
        data: {
          path: "system.gems.ruby",
        },
      },
      {
        name: "Jade",
        type: "attribute",
        img: CONFIG.SMT.gemIcons.jade,
        abbreviation: `{#} ${game.i18n.localize("SMT.gems.jade.name")}`,
        data: {
          path: "system.gems.jade",
        },
      },
      {
        name: "Opal",
        type: "attribute",
        img: CONFIG.SMT.gemIcons.opal,
        abbreviation: `{#} ${game.i18n.localize("SMT.gems.opal.name")}`,
        data: {
          path: "system.gems.opal",
        },
      },
      {
        name: "Amethyst",
        type: "attribute",
        img: CONFIG.SMT.gemIcons.amethyst,
        abbreviation: `{#} ${game.i18n.localize("SMT.gems.amethyst.name")}`,
        data: {
          path: "system.gems.amethyst",
        },
      },
      {
        name: "Agate",
        type: "attribute",
        img: CONFIG.SMT.gemIcons.agate,
        abbreviation: `{#} ${game.i18n.localize("SMT.gems.agate.name")}`,
        data: {
          path: "system.gems.agate",
        },
      },
      {
        name: "Turquoise",
        type: "attribute",
        img: CONFIG.SMT.gemIcons.turquoise,
        abbreviation: `{#} ${game.i18n.localize("SMT.gems.turquoise.name")}`,
        data: {
          path: "system.gems.turquoise",
        },
      },
      {
        name: "Garnet",
        type: "attribute",
        img: CONFIG.SMT.gemIcons.garnet,
        abbreviation: `{#} ${game.i18n.localize("SMT.gems.garnet.name")}`,
        data: {
          path: "system.gems.garnet",
        },
      },
      {
        name: "Onyx",
        type: "attribute",
        img: CONFIG.SMT.gemIcons.onyx,
        abbreviation: `{#} ${game.i18n.localize("SMT.gems.onyx.name")}`,
        data: {
          path: "system.gems.onyx",
        },
      },
      {
        name: "Coral",
        type: "attribute",
        img: CONFIG.SMT.gemIcons.coral,
        abbreviation: `{#} ${game.i18n.localize("SMT.gems.coral.name")}`,
        data: {
          path: "system.gems.coral",
        },
      },
      {
        name: "Aquamarine",
        type: "attribute",
        img: CONFIG.SMT.gemIcons.aquamarine,
        abbreviation: `{#} ${game.i18n.localize("SMT.gems.aquamarine.name")}`,
        data: {
          path: "system.gems.aquamarine",
        },
      },
    ],
  });
}
