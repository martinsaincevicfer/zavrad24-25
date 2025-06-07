import {Projekt} from "./Projekt";
import {Recenzija} from "./Recenzija.ts";

export interface Ugovor {
  id: number;
  status: string;
  datumPocetka: string;
  datumZavrsetka: string | null;
  ponudaId: number;
  nazivProjekta: string;
  nazivKorisnika: string;
  projekt: Projekt;
  recenzija: Recenzija | null;
}