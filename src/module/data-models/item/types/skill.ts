import { Skill } from "../../../documents/item/item.js";
import AttackDataModel from "../../embedded/attack.js";
import SmtBaseItemData from "../abstract/base.js";

export default class SkillData extends SmtBaseItemData {
  override readonly type = "skill";

  override readonly equippable = false;

  get resourceType(): ResourceType {
    const data = this._systemData;
    const attackType = data.attackData.attackType;

    if (attackType === "phys") {
      return "hp";
    }

    return "mp";
  }

  static override defineSchema() {
    const fields = foundry.data.fields;

    return {
      ...super.defineSchema(),
      oneShot: new fields.BooleanField(),
      used: new fields.BooleanField(),
      inheritType: new fields.StringField(),
      attackData: new fields.EmbeddedDataField(AttackDataModel),
    };
  }

  override prepareBaseData() {
    const data = this._systemData;
    const attackData = data.attackData;

    if (attackData.attackType === "talk") {
      attackData.affinity = "talk";
    }

    // Grievous basic strike hack
    const skill = this.parent as Skill;
    if (skill.name === "Basic Strike") {
      data.costType = "none";
    } else {
      data.costType = attackData.attackType === "phys" ? "hp" : "mp";
    }
  }
}
