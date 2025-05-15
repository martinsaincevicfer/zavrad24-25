export interface Vjestina {
    id: number;
    naziv: string;
    kategorija: string;
}

export interface Projekt {
    id: number;
    naziv: string;
    opis: string;
    budzet: number;
    rok: string;
    datumStvaranja: string;
    korisnikId: number;
    vjestine: Vjestina[];
}