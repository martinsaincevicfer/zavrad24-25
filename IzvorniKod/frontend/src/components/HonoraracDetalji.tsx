import React from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {HonoraracDTO} from '../types/Honorarac';
import Header from './Header';
import axiosInstance from '../utils/axiosConfig';


const HonoraracDetalji: React.FC = () => {
  const {id} = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [honorarac, setHonorarac] = React.useState<HonoraracDTO | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchHonorarac = async () => {
      try {
        if (!id) throw new Error('ID honorarca nije definiran');
        const response = await axiosInstance.get<HonoraracDTO>(`/honorarci/${id}`);
        setHonorarac(response.data);
        setError(null);
      } catch (error) {
        console.error('Greška pri dohvaćanju profila:', error);
        setError('Došlo je do pogreške prilikom dohvaćanja podataka.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHonorarac();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Učitavanje...</div>
      </div>
    );
  }

  if (error || !honorarac) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Honorarac nije pronađen.'}</p>
          <button
            onClick={() => navigate('/honorarci')}
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
      <Header/>
      <div className="container max-w-7xl mx-auto mt-8 px-3 sm:px-6 lg:px-9">
        <h1 className="text-3xl font-bold mb-6">
          {honorarac.tip === 'TVRTKA' ? honorarac.nazivTvrtke : `${honorarac.ime} ${honorarac.prezime}`}
        </h1>

        <div className="rounded-lg shadow-md p-8 space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              {honorarac.tip === 'TVRTKA' ? 'Podaci o tvrtki' : 'Osobni podaci'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {honorarac.tip === 'TVRTKA' ? (
                <>
                  <div>
                    <p className="font-medium">Naziv tvrtke:</p>
                    <p>{honorarac.nazivTvrtke}</p>
                  </div>
                  <div>
                    <p className="font-medium">OIB:</p>
                    <p>{honorarac.oib}</p>
                  </div>
                  <div>
                    <p className="font-medium">Adresa tvrtke:</p>
                    <p>{honorarac.adresaTvrtke}</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="font-medium">Ime:</p>
                    <p>{honorarac.ime}</p>
                  </div>
                  <div>
                    <p className="font-medium">Prezime:</p>
                    <p>{honorarac.prezime}</p>
                  </div>
                  <div>
                    <p className="font-medium">Adresa:</p>
                    <p>{honorarac.adresa}</p>
                  </div>
                </>
              )}
              <div>
                <p className="font-medium">Email:</p>
                <p>{honorarac.email}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Profesionalni profil</h2>
            <div className="space-y-6">
              <div>
                <p className="font-medium mb-2">Opis:</p>
                <p>{honorarac.kratkiOpis}</p>
              </div>
              <div>
                <p className="font-medium mb-2">Edukacija:</p>
                <p>{honorarac.edukacija}</p>
              </div>
              <div>
                <p className="font-medium mb-2">Iskustvo:</p>
                <p>{honorarac.iskustvo}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Vještine</h2>
            <div className="flex flex-wrap gap-2">
              {honorarac.vjestine.map((vjestina) => (
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
            <p>{new Date(honorarac.datumStvaranja).toLocaleDateString('hr-HR')}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HonoraracDetalji;