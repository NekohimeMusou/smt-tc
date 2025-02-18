interface ModifierDialogData {
  name?: string;
  hint?: string;
}

interface ModifierDialogResult {
  mod?: number;
  cancelled?: boolean;
}

interface DialogHTMLElement extends HTMLElement {
  mod?: { value?: string };
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
                    ($(html)[0].querySelector("form") as DialogHTMLElement)?.mod
                      ?.value ?? "0",
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
