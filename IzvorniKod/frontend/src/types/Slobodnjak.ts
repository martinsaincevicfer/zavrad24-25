export interface Korisnik {
    id: number;
    ime: string;
    prezime: string;
    email: string;
    naziv: string;
}

export interface Slobodnjak {
    id: number;
    slobodnjakId: number;
    kratkiOpis: string;
    edukacija: string;
    iskustvo: string;
    datumStvaranja: string;
    korisnik: Korisnik;
}
