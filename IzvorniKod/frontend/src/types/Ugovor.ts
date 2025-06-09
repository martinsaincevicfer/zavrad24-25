import {Projekt} from "./Projekt";
import {Recenzija} from "./Recenzija.ts";
import {Ponuda} from "./Ponuda.ts";

export interface Ugovor {
  id: number;
  status: string;
  datumPocetka: string;
  datumZavrsetka: string | null;
  ponuda: Ponuda;
  projekt: Projekt;
  recenzija: Recenzija | null;
}