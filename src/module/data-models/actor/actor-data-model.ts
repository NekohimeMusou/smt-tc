import SmtActor from "../../documents/actor/actor.js";
import SmtDemonData from "./types/demon.js";
import SmtFiendData from "./types/fiend.js";
import SmtHumanData from "./types/human.js";

export type Fiend = Subtype<SmtActor, "fiend">;
export type Demon = Subtype<SmtActor, "demon">;
export type Human = Subtype<SmtActor, "human">;

export const ACTORMODELS = {
  fiend: SmtFiendData,
  demon: SmtDemonData,
  human: SmtHumanData,
} as const;
