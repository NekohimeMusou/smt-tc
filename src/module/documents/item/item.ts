import { ITEMMODELS } from "../../data-models/item/item-data-model.js";
import SmtActiveEffect from "../active-effect/active-effect.js";
import SmtActor from "../actor/actor.js";

export type InventoryItem = Subtype<SmtItem, "inventoryItem">;
export type Weapon = Subtype<SmtItem, "weapon">;
export type Armor = Subtype<SmtItem, "armor">;
export type Magatama = Subtype<SmtItem, "magatama">;
export type Skill = Subtype<SmtItem, "skill">;

export type AttackItem = InventoryItem | Weapon | Skill;

export class SmtItem extends Item<
  typeof ITEMMODELS,
  SmtActor,
  SmtActiveEffect
> {
  isAttackItem(): this is AttackItem {
    return (this as AttackItem).system.attackData !== undefined;
  }

  isWeapon(): this is Weapon {
    return this.system.type === "weapon";
  }

  get isGun(): boolean {
    return this.isWeapon() && this.system.weaponType === "gun";
  }

  async toggleField(fieldId: string, forcedState: boolean | undefined) {
    if (!Object.hasOwn(this.system, fieldId)) {
      return;
    }

    //@ts-expect-error no-implicit-any: I'm being real lazy here
    const newState = forcedState ?? !this.system?.[fieldId] ?? false;

    const updates = Object.fromEntries([[`system.${fieldId}`, newState]]);

    await this.update(updates);

    return newState;
  }

  async addItemsToStack(qty: number) {
    const data = this.system;

    await this.update({ "system.qty": Math.max(data.qty + qty, 0) });
  }

  async consumeItem() {
    const data = this.system;

    // Don't do anything if there's no actor
    if (!this.parent) {
      return;
    }

    if (data.qty <= 1) {
      await this.delete();
    } else {
      await this.update({ "system.qty": data.qty - 1 });
    }
  }

  /**
   * Fire a gun, subtract ammo, and fail with a message if not enough
   * Return value: Was it successfully fired?
   */
  async fireGun() {
    if (!this.isGun) {
      const action = game.i18n.localize("SMT.error.notAGun.fire");
      const msg = game.i18n.format("SMT.error.notAGun.msg", { action });
      ui.notifications.notify(msg);
      return false;
    }

    const data = this.system;

    const useAlternateCost = data.useAlternateCost;

    const ammoCost = useAlternateCost ? data.alternateCost : data.cost;

    const currentAmmo = (this as Weapon).system.ammo.value ?? 0;

    if (ammoCost > currentAmmo) {
      const msg = game.i18n.localize("SMT.error.insufficientAmmo");
      ui.notifications.notify(msg);
      return false;
    }

    const newAmmo = currentAmmo - ammoCost;

    const updates = { "system.ammo.value": newAmmo };

    await this.update(updates);

    return true;
  }

  // Return value: Was the cost paid?
  // Always returns true unless there's a cost to be paid
  async payCost() {
    const actor = this.parent;
    const costType = this.system.costType;
    if (!actor || costType === "none") {
      return true;
    }

    if (this.isGun) {
      return await this.fireGun();
    }

    if (costType === "consumeItem") {
      await this.consumeItem();
      return true;
    }

    const data = (this as Skill).system;
    const resourceType = data.resourceType;
    const cost = data.costsAll ? actor.system[resourceType].value : data.cost;
    const currentValue = actor.system[resourceType].value;

    if (currentValue < cost) {
      return false;
    }

    const newValue = currentValue - cost;
    const updates = Object.fromEntries([
      [`system.${resourceType}.value`, newValue],
    ]);

    await actor.update(updates);

    return true;
  }
}
