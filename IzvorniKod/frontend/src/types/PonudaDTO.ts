export interface PonudaDTO {
  id: number;
  klijentId: number;
  honoraracId: number;
  naziv: string;
  opis: string;
  budzet: number | null;
  rok: string;
  status: string;
  datumStvaranja: string;
}