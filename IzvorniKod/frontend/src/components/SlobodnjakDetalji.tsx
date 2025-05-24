import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SlobodnjakDTO } from '../types/Slobodnjak';
import Header from "./Header.tsx";
import axiosInstance from "../utils/axiosConfig.ts";

const SlobodnjakDetalji: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [slobodnjak, setSlobodnjak] = React.useState<SlobodnjakDTO | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchSlobodnjak = async () => {
      try {
        if (!id) throw new Error('ID projekta nije definiran');
        const response = await axiosInstance.get(`/slobodnjaci/${id}`);
        setSlobodnjak(response.data);
        setError(null);
      } catch (error) {
        console.error('Greška pri dohvaćanju profila:', error);
        setError('Došlo je do pogreške prilikom dohvaćanja podataka.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlobodnjak();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Učitavanje...</div>
      </div>
    );
  }

  if (error || !slobodnjak) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Slobodnjak nije pronađen.'}</p>
          <button
            onClick={() => navigate('/slobodnjaci')}
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
      <Header />
      <div className="container max-w-7xl mx-auto mt-8 px-3 sm:px-6 lg:px-9">
        <h1 className="text-3xl font-bold mb-6">
          {slobodnjak.tip === 'TVRTKA' ? slobodnjak.nazivTvrtke : `${slobodnjak.ime} ${slobodnjak.prezime}`}
        </h1>

        <div className="rounded-lg shadow-md p-8 space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              {slobodnjak.tip === 'TVRTKA' ? 'Podaci o tvrtki' : 'Osobni podaci'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {slobodnjak.tip === 'TVRTKA' ? (
                <>
                  <div>
                    <p className="font-medium">Naziv tvrtke:</p>
                    <p>{slobodnjak.nazivTvrtke}</p>
                  </div>
                  <div>
                    <p className="font-medium">OIB:</p>
                    <p>{slobodnjak.oib}</p>
                  </div>
                  <div>
                    <p className="font-medium">Adresa tvrtke:</p>
                    <p>{slobodnjak.adresaTvrtke}</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="font-medium">Ime:</p>
                    <p>{slobodnjak.ime}</p>
                  </div>
                  <div>
                    <p className="font-medium">Prezime:</p>
                    <p>{slobodnjak.prezime}</p>
                  </div>
                  <div>
                    <p className="font-medium">Adresa:</p>
                    <p>{slobodnjak.adresa}</p>
                  </div>
                </>
              )}
              <div>
                <p className="font-medium">Email:</p>
                <p>{slobodnjak.email}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Profesionalni profil</h2>
            <div className="space-y-6">
              <div>
                <p className="font-medium mb-2">Opis:</p>
                <p>{slobodnjak.kratkiOpis}</p>
              </div>
              <div>
                <p className="font-medium mb-2">Edukacija:</p>
                <p>{slobodnjak.edukacija}</p>
              </div>
              <div>
                <p className="font-medium mb-2">Iskustvo:</p>
                <p>{slobodnjak.iskustvo}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Vještine</h2>
            <div className="flex flex-wrap gap-2">
              {slobodnjak.vjestine.map((vjestina) => (
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
            <p>{new Date(slobodnjak.datumStvaranja).toLocaleDateString('hr-HR')}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SlobodnjakDetalji;