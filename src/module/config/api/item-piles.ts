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
    CURRENCIES: [
      {
        name: "macca",
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
        type: "item",
        img: "icons/commodities/gems/gem-faceted-radiant-teal.webp",
        abbreviation: "{#} diamond",
        data: {
          item: {
            name: "Diamond",
            type: "inventoryItem",
            img: "icons/commodities/gems/gem-faceted-radiant-teal.webp",
            system: {
              description:
                "<p>A beautiful gemstone, symbolizing pure love.</p>",
            },
          },
        },
      },
      {
        name: "Pearl",
        type: "item",
        img: "icons/commodities/gems/pearl-white-oval.webp",
        abbreviation: "{#} pearl",
        data: {
          item: {
            name: "Pearl",
            type: "inventoryItem",
            img: "icons/commodities/gems/pearl-white-oval.webp",
            system: {
              description: "<p>A beautiful gemstone, symbolizing chastity.</p>",
            },
          },
        },
      },
      {
        name: "Sapphire",
        type: "item",
        img: "icons/commodities/gems/gem-faceted-radiant-blue.webp",
        abbreviation: "{#} sapphire",
        data: {
          item: {
            name: "Sapphire",
            type: "inventoryItem",
            img: "icons/commodities/gems/gem-faceted-radiant-blue.webp",
            system: {
              description: "<p>A beautiful gemstone, symbolizing charity.</p>",
            },
          },
        },
      },
      {
        name: "Emerald",
        type: "item",
        img: "icons/commodities/gems/gem-cut-table-green.webp",
        abbreviation: "{#} emerald",
        data: {
          item: {
            name: "Emerald",
            type: "inventoryItem",
            img: "icons/commodities/gems/gem-cut-table-green.webp",
            system: {
              description: "<p>A beautiful gemstone, symbolizing marriage.</p>",
            },
          },
        },
      },
      {
        name: "Ruby",
        type: "item",
        img: "icons/commodities/gems/gem-faceted-radiant-red.webp",
        abbreviation: "{#} ruby",
        data: {
          item: {
            name: "Ruby",
            type: "inventoryItem",
            img: "icons/commodities/gems/gem-faceted-radiant-red.webp",
            system: {
              description: "<p>A beautiful gemstone, symbolizing passion.</p>",
            },
          },
        },
      },
      {
        name: "Jade",
        type: "item",
        img: "icons/commodities/gems/gem-raw-rough-green-yellow.webp",
        abbreviation: "{#} jade",
        data: {
          item: {
            name: "Jade",
            type: "inventoryItem",
            img: "icons/commodities/gems/gem-raw-rough-green-yellow.webp",
            system: {
              description: "<p>A beautiful gemstone, symbolizing fortune.</p>",
            },
          },
        },
      },
      {
        name: "Opal",
        type: "item",
        img: "icons/commodities/gems/pearl-natural.webp",
        abbreviation: "{#} opal",
        data: {
          item: {
            name: "Opal",
            type: "inventoryItem",
            img: "icons/commodities/gems/pearl-natural.webp",
            system: {
              description:
                "<p>A beautiful gemstone, symbolizing happiness.</p>",
            },
          },
        },
      },
      {
        name: "Amethyst",
        type: "item",
        img: "icons/commodities/gems/gem-cut-faceted-square-purple.webp",
        abbreviation: "{#} amethyst",
        data: {
          item: {
            name: "Amethyst",
            type: "inventoryItem",
            img: "icons/commodities/gems/gem-cut-faceted-square-purple.webp",
            system: {
              description:
                "<p>A beautiful gemstone, symbolizing sincerity.</p>",
            },
          },
        },
      },
      {
        name: "Agate",
        type: "item",
        img: "icons/commodities/gems/gem-faceted-octagon-yellow.webp",
        abbreviation: "{#} agate",
        data: {
          item: {
            name: "Agate",
            type: "inventoryItem",
            img: "icons/commodities/gems/gem-faceted-octagon-yellow.webp",
            system: {
              description: "<p>A beautiful gemstone, symbolizing truth.</p>",
            },
          },
        },
      },
      {
        name: "Turquoise",
        type: "item",
        img: "icons/commodities/gems/pearl-turquoise.webp",
        abbreviation: "{#} turquoise",
        data: {
          item: {
            name: "Turquoise",
            type: "inventoryItem",
            img: "icons/commodities/gems/pearl-turquoise.webp",
            system: {
              description: "<p>A beautiful gemstone, symbolizing safety.</p>",
            },
          },
        },
      },
      {
        name: "Garnet",
        type: "item",
        img: "icons/commodities/gems/gem-rough-navette-red.webp",
        abbreviation: "{#} garnet",
        data: {
          item: {
            name: "Garnet",
            type: "inventoryItem",
            img: "icons/commodities/gems/gem-rough-navette-red.webp",
            system: {
              description:
                "<p>A beautiful gemstone, symbolizing friendship.</p>",
            },
          },
        },
      },
      {
        name: "Onyx",
        type: "item",
        img: "icons/commodities/gems/gem-faceted-round-black.webp",
        abbreviation: "{#} onyx",
        data: {
          item: {
            name: "Onyx",
            type: "inventoryItem",
            img: "icons/commodities/gems/gem-faceted-round-black.webp",
            system: {
              description: "<p>A beautiful gemstone, symbolizing trust.</p>",
            },
          },
        },
      },
      {
        name: "Coral",
        type: "item",
        img: "icons/commodities/gems/pearl-purple-rough.webp",
        abbreviation: "{#} coral",
        data: {
          item: {
            name: "Coral",
            type: "inventoryItem",
            img: "icons/commodities/gems/pearl-purple-rough.webp",
            system: {
              description: "<p>A beautiful gemstone, symbolizing wisdom.</p>",
            },
          },
        },
      },
      {
        name: "Aquamarine",
        type: "item",
        img: "icons/commodities/gems/gem-shattered-blue.webp",
        abbreviation: "{#} aquamarine",
        data: {
          item: {
            name: "Aquamarine",
            type: "inventoryItem",
            img: "icons/commodities/gems/gem-shattered-blue.webp",
            system: {
              description: "<p>A beautiful gemstone, symbolizing grace.</p>",
            },
          },
        },
      },
    ],
  });
}
