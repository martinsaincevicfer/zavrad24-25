export interface PrijavaDTO {
  id: number;
  status: string;
  iznos: number;
  poruka: string;
  datumStvaranja: string;
  projekt: ProjektDTO;
  honorarac: HonoraracDTO;
}

export interface ProjektDTO {
  id: number;
  naziv: string;
  opis: string;
  budzet: number;
  rok: string;
  datumStvaranja: string;
  korisnikId: number;
  vjestine: VjestinaDTO[];
}

export interface HonoraracDTO {
  id: number;
  ime?: string;
  prezime?: string;
  email: string;
  tvrtka?: string;
}

export interface VjestinaDTO {
  id: number;
  naziv: string;
}