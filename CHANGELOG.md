# Changelog

<!-- markdownlint-disable MD024 -->

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
