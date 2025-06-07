import {Ponuditelj} from "./Ponuditelj.ts";
import {Projekt} from "./Projekt.ts";

export interface Ponuda {
  id: number;
  status: string;
  iznos: number;
  poruka: string;
  rokZaPrihvacanje: string;
  datumStvaranja: string;
  projekt: Projekt;
  ponuditelj: Ponuditelj;
}