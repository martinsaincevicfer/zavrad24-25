import {Projekt} from "./Projekt";

export interface Ugovor {
  id: number;
  status: string;
  datumPocetka: string;
  datumZavrsetka: string | null;
  prijavaId: number;
  nazivProjekta: string;
  nazivKorisnika: string;
  projekt: Projekt;
}