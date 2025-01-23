import { SmtDemonData } from "./types/demon.js";
import { SmtFiendData } from "./types/fiend.js";
import { SmtHumanData } from "./types/human.js";

export const ACTORMODELS = {
  demon: SmtDemonData,
  human: SmtHumanData,
  fiend: SmtFiendData,
} as const;
