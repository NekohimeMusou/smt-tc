import { SmtDemonData } from "./types/demon.js";
import { SmtFiendData } from "./types/fiend.js";
import { SmtHumanData } from "./types/human.js";

export const ACTORMODELS = {
  fiend: SmtFiendData,
  demon: SmtDemonData,
  human: SmtHumanData,
} as const;
