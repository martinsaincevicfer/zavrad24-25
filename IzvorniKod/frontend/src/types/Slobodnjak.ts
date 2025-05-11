export interface VjestinaDTO {
    id: number;
    naziv: string;
}

export interface SlobodnjakDTO {
    id: number;
    tip: "OSOBA" | "TVRTKA";
    email: string;
    kratkiOpis: string;
    edukacija: string;
    iskustvo: string;
    datumStvaranja: string;
    vjestine: VjestinaDTO[];
    
    ime?: string;
    prezime?: string;
    adresa?: string;
    
    nazivTvrtke?: string;
    oib?: string;
    adresaTvrtke?: string;
}