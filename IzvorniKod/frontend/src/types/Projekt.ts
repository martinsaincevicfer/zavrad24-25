import {Vjestina} from "./Vjestina.ts";
import {Korisnik} from "./Korisnik.ts";

export interface Projekt {
  id: number;
  naziv: string;
  opis: string;
  budzet: number;
  rok: string;
  datumStvaranja: string;
  narucitelj: Korisnik;
  vjestine: Vjestina[];
}