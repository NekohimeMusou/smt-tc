export async function createBasicStrike(
  document: Actor,
  options: DatabaseCreateOperation,
  userId: string,
) {
  if (
    userId !== game.user.id ||
    [...document.items.values()].find((item) => item.name === "Basic Strike")
  ) {
    return;
  }

  await document.createEmbeddedDocuments("Item", [
    {
      name: "Basic Strike",
      type: "skill",
      img: "icons/skills/melee/unarmed-punch-fist.webp",
      system: {
        attackData: { canBeDodged: true, hasPowerRoll: true, potency: 0 },
      },
    },
  ]);
}
