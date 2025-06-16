import React from 'react';
import {Ponuda} from '../types/Ponuda';
import {Link} from 'react-router-dom';
import {authService} from "../services/authService.ts";
import {Korisnik} from "../types/Korisnik.ts";

interface PonudaPopisProps {
  ponude: Ponuda[];
  formatDatum: (datum: string) => string;
  onPrihvatiPonudu: (ponudaId: number) => Promise<void>;
  korisnik: Korisnik | null;
  onEditPonuda: (ponuda: Ponuda) => void;
  onDeletePonuda: (ponudaId: number) => void;
}

const PonudaPopis: React.FC<PonudaPopisProps> = ({
                                                   ponude,
                                                   formatDatum,
                                                   onPrihvatiPonudu,
                                                   korisnik,
                                                   onEditPonuda,
                                                   onDeletePonuda,
                                                 }) => {
  const ulogiraniKorisnik = authService.getCurrentUser();

  return (
    <div className="">
      <h2 className="text-l md:text-xl font-bold mb-4">Ponude za projekt</h2>
      {ponude.length === 0 ? (
        <p>Trenutno nema ponuda za ovaj projekt.</p>
      ) : (
        <ul className="space-y-4 h-1/6 md:h-1/5 overflow-y-scroll">
          {ponude.map((ponuda) => (
            <div
              className="flex flex-col md:flex-row gap-5 items-start justify-between border rounded-lg p-3 text-l bg-gray-100 dark:bg-gray-800">
              <li key={ponuda.id}
                  className="mt-0 pt-0"
              >
                <Link
                  to={`/ponuditelji/${ponuda.ponuditelj.id}`}
                  className="text-blue-500 hover:text-blue-600 text-xl text-center"
                >
                  {ponuda.ponuditelj.ime} {ponuda.ponuditelj.prezime} {ponuda.ponuditelj.nazivTvrtke} ({ponuda.ponuditelj.email})
                </Link>
                <p className="text-m md:text-l">
                  <strong className="text-m md:text-l">Iznos:</strong> {ponuda.iznos} €
                </p>
                <p className="text-m md:text-l">
                  <strong className="text-m md:text-l">Poruka:</strong> {ponuda.poruka}
                </p>
                <p className="text-m md:text-l">
                  <strong className="text-m md:text-l">Datum slanja
                    ponude:</strong> {formatDatum(ponuda.datumStvaranja)}
                </p>
                <p className="text-m md:text-l">
                  <strong className="text-m md:text-l">Rok za prihvaćanje
                    ponude:</strong> {formatDatum(ponuda.rokZaPrihvacanje)}
                </p>

                {ponuda.status === 'aktivna' && (ulogiraniKorisnik === korisnik?.email) && (
                  <button
                    onClick={() => onPrihvatiPonudu(ponuda.id)}
                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Prihvati ponudu
                  </button>
                )}
              </li>

              {ponuda.ponuditelj.email === ulogiraniKorisnik && ponuda.status !== 'prihvacena' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => onEditPonuda(ponuda)}
                    className="bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Uredi
                  </button>
                  <button
                    onClick={() => onDeletePonuda(ponuda.id)}
                    className="bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Obriši
                  </button>
                </div>
              )}
            </div>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PonudaPopis;