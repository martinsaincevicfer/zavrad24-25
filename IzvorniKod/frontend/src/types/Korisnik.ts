interface BaseKorisnik {
  id: number;
  email: string;
  tip: 'TVRTKA' | 'OSOBA';
}

export interface TvrtkaDTO extends BaseKorisnik {
  oib: string;
  nazivTvrtke: string;
  adresa: string;
}

export interface OsobaDTO extends BaseKorisnik {
  ime: string;
  prezime: string;
  adresa: string;
}

export type KorisnikDTO = TvrtkaDTO | OsobaDTO;