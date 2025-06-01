export interface Ugovor {
  id: number;
  status: string;
  datumPocetka: string;
  datumZavrsetka: string | null;
  prijavaId: number;
}