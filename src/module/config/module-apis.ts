declare global {
  interface Game {
    itempiles: {
      API: {
        addSystemIntegration: (a: object) => Promise<void>;
      };
    };
  }

  interface HOOKS {
    "item-piles-ready": () => Promise<void>;
  }
}

export default function registerModuleAPIs() {
  Hooks.once("item-piles-ready", async () => {
    await game.itempiles.API.addSystemIntegration({
      ACTOR_CLASS_TYPE: "human",
      ITEM_QUANTITY_ATTRIBUTE: "system.qty",
      ITEM_PRICE_ATTRIBUTE: "system.price",
      ITEM_FILTERS: [
        {
          path: "type",
          filters: "skill",
        },
      ],
      UNSTACKABLE_ITEM_TYPES: ["melee", "gun", "armor"],
      ITEM_SIMILARITIES: ["name", "type"],
      CURRENCIES: [
        {
          primary: true,
          type: "attribute",
          img: "icons/commodities/currency/coin-yingyang.webp",
          abbreviation: "{#}mc",
          data: {
            path: "system.macca",
          },
        },
      ],
    });
  });
}
