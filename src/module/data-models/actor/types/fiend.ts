import SmtBaseActorData from "../abstract/base.js";

export default class SmtFiendData extends SmtBaseActorData {
  override readonly type = "fiend";

  override prepareBaseData() {
    super.prepareBaseData();

    const data = this._systemData;
    const equippedMagatama = data.equippedMagatama;

    if (equippedMagatama) {
      data.affinities = equippedMagatama.system.affinities;
    }
  }
}
