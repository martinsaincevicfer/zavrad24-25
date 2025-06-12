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
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">Ponude za projekt</h2>
      {ponude.length === 0 ? (
        <p>Trenutno nema ponuda za ovaj projekt.</p>
      ) : (
        <ul className="space-y-4">
          {ponude.map((ponuda) => (
            <li key={ponuda.id} className="border rounded-lg p-4">
              <p>
                Ponuditelj:
                <Link
                  to={`/ponuditelji/${ponuda.ponuditelj.id}`}
                  className="text-blue-500 hover:text-blue-600"
                >
                  {ponuda.ponuditelj.ime} {ponuda.ponuditelj.prezime} {ponuda.ponuditelj.nazivTvrtke} ({ponuda.ponuditelj.email})
                </Link>
              </p>
              <p>
                <strong>Iznos:</strong> {ponuda.iznos} €
              </p>
              <p>
                <strong>Poruka:</strong> {ponuda.poruka}
              </p>
              <p>
                <strong>Rok za prihvaćanje ponude:</strong> {formatDatum(ponuda.rokZaPrihvacanje)}
              </p>
              <p>
                <strong>Datum slanja ponude:</strong> {formatDatum(ponuda.datumStvaranja)}
              </p>

              {ponuda.status === 'aktivna' && (ulogiraniKorisnik === korisnik?.email) && (
                <button
                  onClick={() => onPrihvatiPonudu(ponuda.id)}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Prihvati ponudu
                </button>
              )}

              {ponuda.ponuditelj.email === ulogiraniKorisnik && ponuda.status !== 'prihvacena' && (
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => onEditPonuda(ponuda)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Uredi
                  </button>
                  <button
                    onClick={() => onDeletePonuda(ponuda.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Obriši
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PonudaPopis;