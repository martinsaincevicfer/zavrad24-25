import {Vjestina} from "./Vjestina.ts";

export interface Ponuditelj {
  id: number;
  tip: "OSOBA" | "TVRTKA";
  email: string;
  kratkiOpis: string;
  edukacija: string;
  iskustvo: string;
  datumStvaranja: string;
  vjestine: Vjestina[];

  ime?: string;
  prezime?: string;
  adresa?: string;

  nazivTvrtke?: string;
  oib?: string;
  adresaTvrtke?: string;
}