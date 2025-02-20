import { SmtDemonData } from "./types/demon.js";
import { SmtFiendData } from "./types/fiend.js";

export const ACTORMODELS = {
  fiend: SmtFiendData,
  demon: SmtDemonData,
} as const;
