# Shin Megami Tensei: Tokyo Conception (Unofficial)

Unofficial Foundry VTT system for Shin Megami Tensei: Tokyo Conception. **This is a fan project not affiliated with LionWing Publishing or ATLUS. Please do not contact them for support.**

**This system does not include a rules compendium. A copy of the rulebook is required to play.** You can get it here: <https://lionwingpublishing.com/collections/shin-megami-tensei-iii-nocturne-the-roleplaying-game-tokyo-conception-core-rulebook>

This system is designed specifically for Tokyo Conception; any compatibility with other flavors of the SMT RPG is coincidental. If you're looking to play a different version of the game, or you just want more flexibility and fewer assumptions than this system provides, check out Alondaar's more broadly-compatible SMT 200X system: <https://github.com/Alondaar/smt-200x>

## Prerelease Disclaimer

This is extremely a work in progress, and a lot of features are not complete yet and it doesn't look too great and there's probably a lot of bugs. If you find some, feel free to raise an issue on Github!

This is a complete rewrite of my original, janky system here: <https://github.com/NekohimeMusou/smt-tc-v1>. This one has more and better features now, except for the skill automation which is still a bit jank in itself.

## Installation

Paste this URL into Foundry's **Install System** dialog and go hog: <https://github.com/NekohimeMusou/smt-tc/releases/latest/download/system.json>

Alternatively, you can download and extract the zip file for the latest release.

## Usage Notes

It should be fairly straightforward if you're familiar with the rules. Each class is its own actor type, and things like your HP and MP multipliers, your XP needed to level, and the fields that appear on your sheet are determined by your class. I tried to keep data entry to a minimum by calculating as much as I could and making some assumptions here and there; most stuff you'd want to change or override that isn't directly available on the sheet or isn't fully implemented, such as modifying a boss's HP and MP, can be done with an Active Effect (see the wiki). If not, let me know!

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
- Game status effects (ailments, -kaja/-kundas, Focus, Defending) are present, but not fully implemented.
  - Ping me or raise an issue if I'm missing any!

## Known Issues

I'm not listing missing features from the old version unless they're especially notable.

- Godawful aesthetics
- Skills don't automatically do anything yet
- It's unclear which tab is active at a given time
- Overriding an elemental affinity with an AE doesn't work correctly

## Special Thanks

CSS stolen from <https://github.com/asacolips-projects/boilerplate>, without which I might never have learned how to Foundry. Kudos!
Also a big shout out to Taragnor and his Persona RPG system (<https://github.com/taragnor/persona>), without whom I'd probably still be trying to figure out how to work Typescript XD
