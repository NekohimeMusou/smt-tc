interface ModifierDialogData {
  name?: string;
  hint?: string;
}

interface ModifierDialogResult {
  mod?: number;
  cancelled?: boolean;
}

interface ModifierDialogHTMLElement extends HTMLElement {
  mod?: { value?: string };
}

interface AttackDialogResult {
  tnMod?: number;
  potency?: number;
  cancelled?: boolean;
}

interface AttackDialogHTMLElement extends HTMLElement {
  tnMod?: { value?: string };
  potency?: { value?: string };
}

export async function showRollModifierDialog({
  name = "Modifier",
  hint = "",
}: ModifierDialogData = {}): Promise<ModifierDialogResult> {
  const template = "systems/smt-tc/templates/dialog/roll-modifier-dialog.hbs";
  const content = await renderTemplate(template, { name, hint });

  return new Promise((resolve) =>
    new Dialog(
      {
        title: name,
        content,
        buttons: {
          ok: {
            label: "OK",
            callback: (html) =>
              resolve({
                mod:
                  parseInt(
                    (
                      $(html)[0].querySelector(
                        "form",
                      ) as ModifierDialogHTMLElement
                    )?.mod?.value ?? "0",
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

export async function showAttackModifierDialog(
  attackName: string,
): Promise<AttackDialogResult> {
  const template = "systems/smt-tc/templates/dialog/attack-modifier-dialog.hbs";
  const content = await renderTemplate(template, { attackName });

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
  const potency = parseInt(element.potency?.value ?? "0") || 0;

  return { tnMod, potency };
}