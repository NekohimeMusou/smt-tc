# Shin Megami Tensei: Tokyo Conception (Unofficial)

Unofficial Foundry VTT system for Shin Megami Tensei: Tokyo Conception. **This is a fan project not affiliated with LionWing Publishing or ATLUS. Please do not contact them for support.**

**This system does not include a rules compendium. A copy of the rulebook is required to play.** You can get it here: <https://lionwingpublishing.com/collections/shin-megami-tensei-iii-nocturne-the-roleplaying-game-tokyo-conception-core-rulebook>

This system is designed specifically for Tokyo Conception; any compatibility with other flavors of the SMT RPG is coincidental. If you're looking to play a different version of the game, or you just want more flexibility and fewer assumptions than this system provides, check out Alondaar's more broadly-compatible SMT X system: <https://github.com/Alondaar/smt-200x>

## Warning - Prerelease

This is based on my original, janky SMT: TC system, located here: <https://github.com/NekohimeMusou/smt-tc-v1>. I moved fast and broke things when I wrote it—developing in tandem with a demo you're running will do that—and now I'm looking to make it more maintainable, more customizable, and less opinionated. It'll also make it easier for me to fix the *numerous* bugs in the original. Nothing in this version is particularly broken as far as I know; what's there works, it just doesn't do much yet.

I plan to reimplement all the features of the original, hopefully with fewer bugs and more customizability! Expect frequent updates!

## Installation

Paste this URL into Foundry's **Install System** dialog and go hog: <https://github.com/NekohimeMusou/smt-tc/releases/latest/download/system.json>

Alternatively, you can download and extract the zip file for the latest release.

## Usage Notes

- All the numbers on the sheet should be calculated correctly (HP, MP, Lv, TNs, Power, Resists).
- The Mods panel has two options, both of which are reflected in the sheet calculations:
  - TN Boosts: Applies an (n \* 20) bonus to TN rolls, to make it quicker to track and apply bonuses like Aid and Concentrate.
  - Multi: Divides all TNs by n, as an approximation for the multi-attack mechanic.
- Clicking the target numbers listed under the "TN" columns will make a success roll.
  - Hold Shift to bring up a dialog that lets you input a custom TN modifier. This can be reversed in the system settings.
  - The "Phys Atk" and "Spell Atk" TNs now make a combined attack and power roll instead of being redundant with the St and Ma TNs.
- Clicking "Phys Power", "Mag Power", or "Gun Power" on the Derived Stats pane will make a power roll.
  - By default, this brings up a dialog where you can enter your attack's potency, and holding Shift rolls without the dialog. This can be reversed in the system settings.
- If the Behavior field contains any text, it'll appear at the top of the Main tab for easy reference.
- Game status effects are present, but only serve for record-keeping for now.

## Known Issues

I'm not listing missing features from the old version unless they're especially notable.

- Out-of-the-box Foundry aesthetics
- Items mostly don't exist

## Special Thanks

CSS stolen from <https://github.com/asacolips-projects/boilerplate>, without which I might never have learned how to Foundry. Kudos!
Also a big shout out to Taragnor and his Persona RPG system, without whom I'd probably still be trying to figure out how to work Typescript XD <https://github.com/taragnor/persona>
