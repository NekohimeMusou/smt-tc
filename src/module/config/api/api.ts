import _onItemPilesReady from "./item-piles.js";

export default function registerModuleAPIs() {
  Hooks.once("item-piles-ready", _onItemPilesReady);
}
