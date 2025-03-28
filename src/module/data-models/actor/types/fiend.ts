import SmtBaseActorData from "../abstract/base.js";

export default class SmtFiendData extends SmtBaseActorData {
  override readonly type = "fiend";

  override prepareBaseData() {
    super.prepareBaseData();

    const data = this._systemData;

    // @ts-expect-error This isn't readonly
    data.hpMultiplier = 6;
    // @ts-expect-error This isn't readonly
    data.mpMultiplier = 3;

    const equippedMagatama = data.equippedMagatama;

    if (equippedMagatama) {
      // @ts-expect-error This isn't readonly
      data.affinities = equippedMagatama.system.affinities;
    }
  }
}
