import { BuffAction } from "./macros/buffs.js";

interface AttackDialogResult {
  tnMod?: number;
  potencyMod?: number;
  cancelled?: boolean;
}

interface AttackDialogHTMLElement extends HTMLElement {
  tnMod?: { value?: string };
  potency?: { value?: string };
}

interface AwardHTMLElement extends HTMLElement {
  xp?: { value?: string };
  macca?: { value?: string };
}

interface AwardDialogResult {
  xp?: number;
  macca?: number;
  cancelled?: boolean;
}

interface BuffHTMLElement extends HTMLElement {
  buff?: { value?: BuffType };
  amount?: { value?: string };
}

interface BuffDialogResult {
  action?: BuffAction;
  amount?: number;
  cancelled?: boolean;
}

export async function showAttackModifierDialog(
  attackName: string,
  description = "",
  auto = false,
  consumeOnUse = false,
  powerRoll = true,
): Promise<AttackDialogResult> {
  const template = "systems/smt-tc/templates/dialog/attack-modifier-dialog.hbs";
  const content = await renderTemplate(template, {
    attackName,
    description,
    auto,
    consumeOnUse,
    powerRoll,
  });

  return new Promise((resolve) =>
    new Dialog(
      {
        title: attackName,
        content,
        buttons: {
          ok: {
            label: "OK",
            callback: (html) => resolve(_processAttackDialogResult(html)),
          },
          cancel: {
            label: "Cancel",
            callback: () => resolve({ cancelled: true }),
          },
        },
        default: "ok",
        close: () => resolve({ cancelled: true }),
      },
      {},
    ).render(true),
  );
}

function _processAttackDialogResult(html: string): AttackDialogResult {
  const element = $(html)[0].querySelector("form") as AttackDialogHTMLElement;

  const tnMod = parseInt(element.tnMod?.value ?? "0") || 0;
  const potencyMod = parseInt(element.potency?.value ?? "0") || 0;

  return { tnMod, potencyMod };
}

export async function renderAwardDialog(): Promise<AwardDialogResult> {
  const template = "systems/smt-tc/templates/dialog/award-dialog.hbs";
  const content = await renderTemplate(template, {});

  return new Promise((resolve) =>
    new Dialog(
      {
        title: game.i18n.localize("SMT.dialog.awardDialogTitle"),
        content,
        buttons: {
          ok: {
            label: "OK",
            callback: (html) =>
              resolve({
                xp:
                  parseInt(
                    ($(html)[0].querySelector("form") as AwardHTMLElement)?.xp
                      ?.value ?? "0",
                  ) || 0,
                macca:
                  parseInt(
                    ($(html)[0].querySelector("form") as AwardHTMLElement)
                      ?.macca?.value ?? "0",
                  ) || 0,
              }),
          },
          cancel: {
            label: "Cancel",
            callback: () => resolve({ cancelled: true }),
          },
        },
        default: "ok",
        close: () => resolve({ cancelled: true }),
      },
      {},
    ).render(true),
  );
}

export async function renderBuffDialog(): Promise<BuffDialogResult> {
  const template = "systems/smt-tc/templates/dialog/buff-dialog.hbs";

  const content = await renderTemplate(template, { buffs: CONFIG.SMT.buffs });

  return new Promise((resolve) =>
    new Dialog(
      {
        title: game.i18n.localize("SMT.actorSheet.buffs"),
        content,
        buttons: {
          ok: {
            label: "OK",
            callback: (html) =>
              resolve({
                action: ($(html)[0].querySelector("form") as BuffHTMLElement)
                  .buff?.value,
                amount:
                  parseInt(
                    ($(html)[0].querySelector("form") as BuffHTMLElement)
                      ?.amount?.value ?? "0",
                  ) || 0,
              }),
          },
          cancel: {
            label: "Cancel",
            callback: () => resolve({ cancelled: true }),
          },
          dekaja: {
            label: game.i18n.localize("SMT.buffs.dekaja"),
            callback: () => resolve({ action: "dekaja" }),
          },
          dekunda: {
            label: game.i18n.localize("SMT.buffs.dekunda"),
            callback: () => resolve({ action: "dekunda" }),
          },
          clearAll: {
            label: game.i18n.localize("SMT.buffs.clearAll"),
            callback: () => resolve({ action: "clearAll" }),
          },
        },
        default: "ok",
        close: () => resolve({ cancelled: true }),
      },
      {},
    ).render(true),
  );
}

interface FountainDialogData {
  hp?: number;
  mp?: number;
  macca?: number;
}

interface FountainDialogResult {
  healed?: boolean;
  insufficientMacca?: boolean;
  cost?: number;
}

export async function renderFountainDialog({
  hp = 0,
  mp = 0,
  macca = 0,
}: FountainDialogData = {}): Promise<FountainDialogResult> {
  const cost = hp + mp * 2;
  const insufficientMacca = macca < cost;
  const template = "systems/smt-tc/templates/dialog/fountain-of-life.hbs";

  const content = await renderTemplate(template, {
    hp,
    mp,
    cost,
    insufficientMacca,
  });

  return new Promise((resolve) =>
    new Dialog(
      {
        title: game.i18n.localize("SMT.dialog.awardDialogTitle"),
        content,
        buttons: {
          yes: {
            label: "Yes",
            callback: () =>
              resolve({ insufficientMacca, healed: !insufficientMacca, cost }),
          },
          no: {
            label: "No",
            callback: () => resolve({ insufficientMacca, healed: false, cost }),
          },
        },
        close: () => resolve({ insufficientMacca, healed: false, cost }),
      },
      {},
    ).render(true),
  );
}
