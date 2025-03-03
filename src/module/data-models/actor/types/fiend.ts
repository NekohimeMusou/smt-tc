import SmtBaseActorData from "../abstract/base.js";

export default class SmtFiendData extends SmtBaseActorData {
  override readonly type = "fiend";

  override prepareBaseData() {
    super.prepareBaseData();

    const data = this._systemData;
    const equippedMagatama = data.equippedMagatama;

    if (equippedMagatama) {
      // @ts-expect-error This isn't readonly
      data.affinities = equippedMagatama.system.affinities;
    }
  }
}
