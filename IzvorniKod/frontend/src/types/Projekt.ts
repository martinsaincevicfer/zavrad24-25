import {Vjestina} from "./Vjestina.ts";
import {Korisnik} from "./Korisnik.ts";

export interface Projekt {
  id: number;
  naziv: string;
  opis: string;
  budzet: number;
  rokIzrade: string;
  datumStvaranja: string;
  narucitelj: Korisnik;
  vjestine: Vjestina[];
}