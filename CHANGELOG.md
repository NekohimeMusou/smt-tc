# Changelog

<!-- markdownlint-disable MD024 -->

## [0.5.8] - 2025-03-20

### Changed

- Update current HP when switching magatama

### Fixed

- Fix overpowered element boost skills

## [0.5.7] - 2025-03-19

### Fixed

- Fix non-updating JSON manifest

## [0.5.6] - 2025-03-19

*Thanks for pointing out the stat cap, chamomileTeacup ⚙!*

### Changed

- Item roll output now displays target ("One", "All", "Self")

### Added

- Let skills and items apply status effects like Focus and Tetraja
- Add "Incense Used" field to actor sheet

### Fixed

- Cap stats at 40

## [0.5.5] - 2025-03-18

### Added

- Add some missing status effects
- Add rollable table compendium

## [0.5.4] - 2025-03-17

*Just remembered I wanted to try adding a healing fountain macro that works with Item Piles, so I did!*

### Added

- Add new, Item Piles vendor-compatible Fountain of Life macro

### Removed

- Remove old, janky, GM-only Fountain of Life macro

## [0.5.3] - 2025-03-17

### Changed

- Change clan actor sheet field placeholder to "Clan"
- Refactor the hell out of item rolls
- Multi-attack sheet mod now applies to Dodge TN (workaround for Pinhole)
- The Focus skill now applies the Focus status
- The Focus status now doubles the power of your next Phys Attack
- The Focus status now fades after using any skill

### Added

- Skill damage accounts for affinities
- Pinhole mod correctly applies to target resists
- Add isAttackItem helper to SmtItem

### Removed

- Get rid of Pierce world setting until it's actually implemented

### Fixed

- Make editableActorSheetBuffs and autoCurseRolls world settings

## [0.5.2] - 2025-03-14

### Changed

- Make Basic Strike an item (automatically created with actor)
- Fly status now implemented (reduces stats and doubles damage taken)
- Defending status now implemented (increases Dodge TN by 20%)
- Rework dice rolls to all use the same template for consistency

### Added

- Attacks with skills now show the damage dealt to each target, accounting for resists (not affinities)
- Fumbling a roll now gives you the Curse status
- Automatically roll for bad Curse effects (can be toggled in settings)
- Add Liftoma status and have Foundry treat it as "flying"

## [0.5.1] - 2025-03-12

### Added

- Add description field to armor sheet

### Fixed

- Fix: Demons not remembering evolve path or inherit traits

## [0.5.0] - 2025-03-11

*The big one: rollable skills!*

### Changed

- Organize embedded data models into their own folder
- Make Force attacks' "shatter" effect work like a normal ailment
- New affinity icons courtesy of the generous [Cannon White]!

### Added

- Skills, weapons, and usable inventory items now make rolls and display output when clicked on the actor sheet
- Attacks consume HP/MP/items, except bullets
- Show a message in chat if an attack's cost can't be paid
- Display a list of targets at the bottom of the output
- More visible warning if you have undistributed/too many stat points
- Element boost skills (should) work

### Removed

- Remove unused Magatama skills field (for now)

### Fixed

- Fix: dice rolls displaying fail instead of autofail result
- Fix: old item migration
- Fix: assorted small output bugs
- Fix: Inventory items not displaying power

## [0.4.4] - 2025-03-08

*Lots of refactoring, but enough small fixes and tweaks piled up that it feels worth releasing.*

### Fixed

- Migrate old "combatants" target to "allCombatants"

### Changed

- Slim down affinity icons and actor sheet a tiny bit
- Miscellaneous cosmetic adjustments
- Cleaned up localization a bit

## [0.4.3] - 2025-03-05

### Fixed

- Fix misaligned weapon column headers on inventory tab
- Migrate old items with "combatants" target instead of "allCombatants"

### Changed

- Move actor sheet Notes section from its own tab to Bio tab
- Change Item Piles integration to use gem fields instead of items
- Improved localization for gems

### Added

- Add gem fields to actors for Item Piles integration
- New world setting: Can non-GMs edit gem fields?

## [0.4.2] - 2025-03-05

### Fixed

- Fix a few quirks in Item Piles support

## [0.4.1] - 2025-03-04

### Changed

- Tweak EN loc for targets

### Fixed

- Fix: Instant Death is now selectable as an attack ailment

## [0.4.0] - 2025-03-03

*Items items items!*

### Changed

- Bold rollable TNs and Power on sheet
- Cosmetic actor sheet changes
- Weapons only appear on main tab if equipped

### Added

- Main actor tab now displays skill ailment
- Curse and Stun ailments now modify autofail threshold
- List weapons on inventory tab
- Add "generic" inventory item type
- Add "generic" item pane for Fiends and Humans
- Add Item Piles integration

### Fixed

- Fix off-by-one error in level calculations

## [0.3.4] - 2025-02-27

*Macros macros macros!*

### Changed

- Add stat getters to top level of actor data model (e.g. `system.ag` instead of `system.stats.ag.value`)
- Editable actor sheet buff fields are now optional

### Added

- Add Apply Buffs macro
- Add Apply Healing Fountain macro
- Add Grant Rewards
- Add Lucky Find macro
- Add Resolve Conflict macro

### Fixed

- Fix: Actor sheet award fields don't work

## [0.3.3] - 2025-02-26

### Changed

- Don't show pointless details pane on passive skills

### Added

- Add Clan field to demon sheet

### Fixed

- Fix: Off-by-one error in Fiend level calculations
- Make field placeholders more consistent
- Fix: Can't equip armor to more than one slot

## [0.3.2] - 2025-02-25

### Fixed

- Fix broken actor sheet
- Fix: Attack roller throws console errors

## [0.3.1] - 2025-02-25

*I felt industrious today, so armor's here too!*

### Changed

- Merged Magatama tab into shared Inventory tab

### Added

- Add Armor item type

## [0.3.0] - 2025-02-25

*The big skills update!*

### Added

- Add Skill item type
- Add Weapon item type
- Support Foundry Active Effects

## [0.2.1] - 2025-02-21

### Fixed

- Fix: Backgrounds and contacts not being saved

## [0.2.0] - 2025-02-20

_Added separate Human and Demon actor types with some custom behavior, and added magatama items for Fiends to use.*

### Changed

- Only show demon-exclusive info on demon sheets
- Fiends now inherit affinities and stat bonuses from their equipped magatama

### Added

- Separate actor types for humans and demons
- Display demon's favored stat on the sheet
- Add magatama item type for Fiends
- Show stat point difference on sheet
- Add actor sheet field for demon base level

## [0.1.4] - 2025-02-20

### Added

- Semi-automate phys and mag attacks

## [0.1.3] - 2025-02-19

### Changed

- Change Personality field name to Behavior
- Make roll dialog options more granular

### Added

- Add status effects
- Add behavior display to main actor sheet tab

## [0.1.2] - 2025-02-19

### Changed

- Require reload for addLevelToGunDamage setting

### Added

- Add HP/MP multiplier fields
- Add sheet tab for biographical data

## [0.1.1] - 2025-02-18

### Added

- Roll gun damage from actor sheet

### Fixed

- Un-break actor sheet

## [0.1.0] - 2025-02-18

_Initial preview release.*

[0.5.8]: https://github.com/NekohimeMusou/smt-tc/releases/tag/v0.5.8
[0.5.7]: https://github.com/NekohimeMusou/smt-tc/releases/tag/v0.5.7
[0.5.6]: https://github.com/NekohimeMusou/smt-tc/releases/tag/v0.5.6
[0.5.5]: https://github.com/NekohimeMusou/smt-tc/releases/tag/v0.5.5
[0.5.4]: https://github.com/NekohimeMusou/smt-tc/releases/tag/v0.5.4
[0.5.3]: https://github.com/NekohimeMusou/smt-tc/releases/tag/v0.5.3
[0.5.2]: https://github.com/NekohimeMusou/smt-tc/releases/tag/v0.5.2
[0.5.1]: https://github.com/NekohimeMusou/smt-tc/releases/tag/v0.5.1
[0.5.0]: https://github.com/NekohimeMusou/smt-tc/releases/tag/v0.5.0
[0.4.4]: https://github.com/NekohimeMusou/smt-tc/releases/tag/v0.4.4
[0.4.3]: https://github.com/NekohimeMusou/smt-tc/releases/tag/v0.4.3
[0.4.2]: https://github.com/NekohimeMusou/smt-tc/releases/tag/v0.4.2
[0.4.1]: https://github.com/NekohimeMusou/smt-tc/releases/tag/v0.4.1
[0.4.0]: https://github.com/NekohimeMusou/smt-tc/releases/tag/v0.4.0
[0.3.4]: https://github.com/NekohimeMusou/smt-tc/releases/tag/v0.3.4
[0.3.3]: https://github.com/NekohimeMusou/smt-tc/releases/tag/v0.3.3
[0.3.2]: https://github.com/NekohimeMusou/smt-tc/releases/tag/v0.3.2
[0.3.1]: https://github.com/NekohimeMusou/smt-tc/releases/tag/v0.3.1
[0.3.0]: https://github.com/NekohimeMusou/smt-tc/releases/tag/v0.3.0
[0.2.1]: https://github.com/NekohimeMusou/smt-tc/releases/tag/v0.2.1
[0.2.0]: https://github.com/NekohimeMusou/smt-tc/releases/tag/v0.2.0
[0.1.4]: https://github.com/NekohimeMusou/smt-tc/releases/tag/v0.1.4
[0.1.3]: https://github.com/NekohimeMusou/smt-tc/releases/tag/v0.1.3
[0.1.2]: https://github.com/NekohimeMusou/smt-tc/releases/tag/v0.1.2
[0.1.1]: https://github.com/NekohimeMusou/smt-tc/releases/tag/v0.1.1
[0.1.0]: https://github.com/NekohimeMusou/smt-tc/releases/tag/v0.1.0

[Cannon White]: https://bsky.app/profile/hencanpro.bsky.social
