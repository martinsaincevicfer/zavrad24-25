interface BaseKorisnik {
  id: number;
  email: string;
  tip: 'tvrtka' | 'osoba';
}

export interface Tvrtka extends BaseKorisnik {
  oib: string;
  nazivTvrtke: string;
  adresa: string;
}

export interface Osoba extends BaseKorisnik {
  ime: string;
  prezime: string;
  adresa: string;
}

export type Korisnik = Tvrtka | Osoba;