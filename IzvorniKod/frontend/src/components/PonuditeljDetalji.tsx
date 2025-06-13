import React from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import {Recenzija} from "../types/Recenzija.ts";
import {Ponuditelj} from "../types/Ponuditelj.ts";

const PonuditeljDetalji: React.FC = () => {
  const {id} = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ponuditelj, setPonuditelj] = React.useState<Ponuditelj | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [recenzije, setRecenzije] = React.useState<Recenzija[]>([]);
  const [recenzijeLoading, setRecenzijeLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPonuditelj = async () => {
      try {
        if (!id) throw new Error('ID ponuditelj nije definiran');
        const response = await axiosInstance.get<Ponuditelj>(`/ponuditelji/${id}`);
        setPonuditelj(response.data);
        setError(null);
      } catch (error) {
        console.error('Greška pri dohvaćanju profila:', error);
        setError('Došlo je do pogreške prilikom dohvaćanja podataka.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPonuditelj();
  }, [id]);

  React.useEffect(() => {
    const fetchRecenzije = async () => {
      if (!id) return;
      try {
        setRecenzijeLoading(true);
        const response = await axiosInstance.get<Recenzija[]>(`/recenzije/ponuditelj/${id}`);
        setRecenzije(response.data);
      } catch (e) {
        setRecenzije([]);
        console.error(e);
      } finally {
        setRecenzijeLoading(false);
      }
    };
    fetchRecenzije();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Učitavanje...</div>
      </div>
    );
  }

  if (error || !ponuditelj) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Ponuditelj nije pronađen.'}</p>
          <button
            onClick={() => navigate('/ponuditelji')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Povratak na popis
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container max-w-8xl mx-auto mt-8 px-3 sm:px-6 lg:px-9">
        <h1 className="text-3xl font-bold mb-6">
          {ponuditelj.tip === 'tvrtka' ? ponuditelj.nazivTvrtke : `${ponuditelj.ime} ${ponuditelj.prezime}`}
        </h1>

        <div className="rounded-lg p-8 space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              {ponuditelj.tip === 'tvrtka' ? 'Podaci o tvrtki' : 'Osobni podaci'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ponuditelj.tip === 'tvrtka' ? (
                <>
                  <div>
                    <p className="font-medium">Naziv tvrtke:</p>
                    <p>{ponuditelj.nazivTvrtke}</p>
                  </div>
                  <div>
                    <p className="font-medium">OIB:</p>
                    <p>{ponuditelj.oib}</p>
                  </div>
                  <div>
                    <p className="font-medium">Adresa tvrtke:</p>
                    <p>{ponuditelj.adresaTvrtke}</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="font-medium">Ime:</p>
                    <p>{ponuditelj.ime}</p>
                  </div>
                  <div>
                    <p className="font-medium">Prezime:</p>
                    <p>{ponuditelj.prezime}</p>
                  </div>
                  <div>
                    <p className="font-medium">Adresa:</p>
                    <p>{ponuditelj.adresa}</p>
                  </div>
                </>
              )}
              <div>
                <p className="font-medium">Email:</p>
                <p>{ponuditelj.email}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Profesionalni profil</h2>
            <div className="space-y-6">
              <div>
                <p className="font-medium mb-2">Opis:</p>
                <p>{ponuditelj.kratkiOpis}</p>
              </div>
              <div>
                <p className="font-medium mb-2">Edukacija:</p>
                <p>{ponuditelj.edukacija}</p>
              </div>
              <div>
                <p className="font-medium mb-2">Iskustvo:</p>
                <p>{ponuditelj.iskustvo}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Vještine</h2>
            <div className="flex flex-wrap gap-2">
              {ponuditelj.vjestine.map((vjestina) => (
                <span
                  key={vjestina.id}
                  className="bg-blue-300 text-blue-800 px-3 py-1 rounded-full"
                >
                  {vjestina.naziv}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="font-medium">Član od:</p>
            <p>{new Date(ponuditelj.datumStvaranja).toLocaleDateString('hr-HR')}</p>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Recenzije</h2>
          {recenzijeLoading ? (
            <div>Učitavanje recenzija...</div>
          ) : recenzije.length === 0 ? (
            <div>Još nema recenzija za ovog ponuditelja.</div>
          ) : (
            <div className="space-y-4">
              {recenzije.map((recenzija, idx) => (
                <div key={idx} className="border rounded p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold">Ocjena:</span>
                    <span>{recenzija.ocjena} / 5</span>
                  </div>
                  <div>
                    <span className="font-bold">Komentar:</span>
                    <span className="ml-2">{recenzija.komentar}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {new Date(recenzija.datumStvaranja).toLocaleDateString('hr-HR')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PonuditeljDetalji;