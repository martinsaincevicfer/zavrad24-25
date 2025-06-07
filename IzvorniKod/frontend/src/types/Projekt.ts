import {Vjestina} from "./Vjestina.ts";

export interface Projekt {
  id: number;
  naziv: string;
  opis: string;
  budzet: number;
  rok: string;
  datumStvaranja: string;
  naruciteljId: number;
  vjestine: Vjestina[];
}