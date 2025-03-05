# Shin Megami Tensei: Tokyo Conception (Unofficial)

Unofficial Foundry VTT system for Shin Megami Tensei: Tokyo Conception. **This is a fan project not affiliated with LionWing Publishing or ATLUS. Please do not contact them for support.**

**This system does not include a rules compendium. A copy of the rulebook is required to play.** You can get it here: <https://lionwingpublishing.com/collections/shin-megami-tensei-iii-nocturne-the-roleplaying-game-tokyo-conception-core-rulebook>

This system is designed specifically for Tokyo Conception; any compatibility with other flavors of the SMT RPG is coincidental. If you're looking to play a different version of the game, or you just want more flexibility and fewer assumptions than this system provides, check out Alondaar's more broadly-compatible SMT X system: <https://github.com/Alondaar/smt-200x>

## Prerelease Disclaimer

This is extremely a work in progress, and a lot of features are not complete yet and it doesn't look too great and there's probably a lot of bugs. If you find some, feel free to raise an issue on Github!

This is based on my original, janky SMT: TC system, located here: <https://github.com/NekohimeMusou/smt-tc-v1>. I moved fast and broke things when I wrote it—developing in tandem with a demo you're running will do that—and now I'm looking to make it more maintainable, more customizable, and less opinionated. It'll also make it easier for me to fix the *numerous* bugs in the original.

I plan to reimplement all the features of the original, hopefully with fewer bugs and more customizability! Expect frequent updates!

## Installation

Paste this URL into Foundry's **Install System** dialog and go hog: <https://github.com/NekohimeMusou/smt-tc/releases/latest/download/system.json>

Alternatively, you can download and extract the zip file for the latest release.

## Usage Notes

It should be fairly straightforward if you're familiar with the rules. Each class is its own actor type, and things like your HP and MP multipliers, your XP needed to level, and the fields that appear on your sheet are determined by your class. I tried to keep data entry to a minimum by calculating as much as I could and making some assumptions here and there; most stuff you'd want to change or override that isn't directly available on the sheet or isn't fully implemented, such as armor and doubling a boss's HP and MP, can be done with an Active Effect (see below). If not, let me know!

Skills will make their own dice rolls when you click on them, eventually.

- All the numbers *should* be calculated correctly (HP, MP, Lv, TNs, Power, Resists, etc).
- The Mods panel has two options, both of which are reflected in the sheet calculations:
  - TN Boosts: Applies an (n \* 20) bonus to TN rolls, to make it quicker to track and apply bonuses like Aid and Concentrate.
  - Multi: Divides all TNs by n, as an approximation for the multi-attack mechanic.
- Clicking the target numbers listed under the "TN" columns on the stats pane will make a success roll.
  - Hold Shift to bring up a dialog that lets you input a custom TN modifier. This can be reversed in the system settings.
- Clicking "Phys Power", "Mag Power", or "Gun Power" on the Derived Stats pane will make a power roll.
  - By default, this brings up a dialog where you can enter your attack's potency, and holding Shift rolls without the dialog. This can be reversed in the system settings.
- Clicking the "Phys Atk" or "Mag Atk" derived TNs will roll a combined accuracy and power check.
  - The dialog opens with the Power modifier box focused, so you can click the "button", type your attack's Potency, and hit enter for a pretty quick attack.
- If a demon's Behavior field contains any text, it'll appear at the top of the Main tab for easy reference.
- Game status effects are present, but only serve for record-keeping for now.

### Active Effects and Data Paths

The system is designed so you can use Foundry's built-in Active Effects feature (the Effects tab on actor and item sheets) to do fun things, such as HP and MP modifiers for bosses and especially passive skills: if you create an Active Effect on a skill, by default it'll automatically apply itself to any actor that "owns" the skill. I recommend using the [Koboldworks - Data Inspector] mod or the console to uncover the data paths you need to use, since this system is under heavy development and some of them are subject to change. For convenience's sake, here's a few that are related to specific skills in the book, have their functionality implemented, and are unlikely to change:

- Might: `system.mods.might` (Boolean)
  - This applies to Phys Attacks (including basic strikes) regardless of affinity (it's compatible with e.g. the Breath Group and Freikugel).
- Lucky Find: `system.mods.luckyFind` (Boolean)
- Expert Dodge: `system.tn.dodge` (Number)
- Sure Shot: `system.tn.gun` (Number)
- Powerful Strikes/Spells/Item Pro: `system.powerBoost.phys`, `system.powerBoost.mag`, `system.powerBoost.item` (Boolean)
  - NOTE: The Item Pro flag exists, but non-magatama items don't yet.
- Amplify Group skills: `system.hpMultiplier` and `system.mpMultiplier`

### Macros

There's now a compendium pack with a few macros to make GMs' lives a little easier! The following are available:

- Apply Buffs: Apply -kaja and -kunda effects; replaces the cumbersome actor sheet UX. Can also clear buffs (Dekaja), debuffs (Dekunda), or both.
- Apply Healing Fountain: Calculate the healing cost for the selected tokens, heal them up, and deduct the macca from their total.
  - If they can't afford the healing, the output will say so and they won't be healed or charged.
  - Resurrection is currently not accounted for.
- Grant Rewards: Add a specified amount of XP and macca to all selected tokens.
  - Rewards are **not** divided between the actors; they each get the full amount.
- Lucky Find: Roll a Lu check for each selected token that has Lucky Find; reports the total number of normal successes and the total number of crits.
  - To make this work, add an Active Effect to your Lucky Find skill that overrides `system.mods.luckyFind` to `true`. That's how the macro knows who has it.
- Resolve Conflict: Displays the total XP and macca rewards for the selected tokens, plus a list of their item drops.

## Recommended Mods

- **Item Piles**: Drop lootable containers into scenes, trade items between players, create shops and player storage, and **way** more. Completely indispensable for games with a lot of looting, buying, and selling!
  - <https://github.com/fantasycalendar/FoundryVTT-ItemPiles>
- **Mana's Compendium Importer**: Export world compendiums to JSON format and import them in other worlds; lets you easily share actors, items/skills, and other things between game worlds.
  - <https://gitlab.com/mkahvi/fvtt-compendium-importer>
- **Status Icon Counters**: I use this to keep track of -kaja/-kunda stacks.
  - <https://gitlab.com/woodentavern/status-icon-counters>
- **Token Health**: Quickly assign damage or healing to multiple tokens at once!
  - <https://github.com/mclemente/fvtt-token-health>
- **Roll of Fate**: Randomly choose a token from the ones you have selected, at random, for random encounters what attack randomly!
  - <https://github.com/Handyfon/roll-of-fate/blob/master/README.md>
- **Koboldworks - Data Inspector**: Lets you inspect the data of an actor or item with one click and no digging in the console. Great for finding Active Effect paths!
  - <https://gitlab.com/koboldworks/agnostic/data-inspector>
- **Drag Ruler**: I don't use the tactical rules in my campaign, but this mod might be useful if you do. Use `actor.system.ag` for the speed attribute.
  - <https://github.com/manuelVo/foundryvtt-drag-ruler/tree/master>

## Known Issues

I'm not listing missing features from the old version unless they're especially notable.

- Godawful aesthetics
- Skills don't automatically do anything yet
- It's unclear which tab is active at a given time
- Overriding an elemental affinity with an AE doesn't work correctly

## Special Thanks

CSS stolen from <https://github.com/asacolips-projects/boilerplate>, without which I might never have learned how to Foundry. Kudos!
Also a big shout out to Taragnor and his Persona RPG system (<https://github.com/taragnor/persona>), without whom I'd probably still be trying to figure out how to work Typescript XD
