import _onItemPilesReady from "./api/item-piles.js";

export default function registerModuleAPIs() {
  Hooks.once("item-piles-ready", _onItemPilesReady);
}
