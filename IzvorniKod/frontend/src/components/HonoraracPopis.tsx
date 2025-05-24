import React from 'react';
import { Link } from 'react-router-dom';
import { HonoraracDTO } from '../types/Honorarac.ts';
import Header from "./Header.tsx";
import axiosInstance from "../utils/axiosConfig.ts";

const HonoraracPopis: React.FC = () => {
  const [honorarci, setHonorarci] = React.useState<HonoraracDTO[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchHonorarci = async () => {
      try {
        const response = await axiosInstance.get('/honorarci');
        setHonorarci(response.data);
      } catch (error) {
        console.error('Greška pri dohvaćanju profila:', error);
        setError("Greška pri dohvaćanju profila.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHonorarci();
  }, []);

  const getPrikazanoIme = (honorarac: HonoraracDTO) => {
    if (honorarac.tip === 'OSOBA') {
      return `${honorarac.ime} ${honorarac.prezime}`;
    }
    return honorarac.nazivTvrtke;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Učitavanje...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="container max-w-7xl mx-auto mt-8 px-3 sm:px-6 lg:px-9">
        <h1 className="text-3xl font-bold mb-8">Popis honoraraca</h1>
        {honorarci.length === 0 ? (
          <p className="text-center">Nema dostupnih honoraraca.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {honorarci.map((honorarac) => (
              <div
                key={honorarac.id}
                className="border rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-bold mb-2">{getPrikazanoIme(honorarac)}</h2>
                <p className="mb-4">{honorarac.kratkiOpis}</p>
                <Link
                  to={`/honorarci/${honorarac.id}`}
                  className="inline-block bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 text-white"
                >
                  Više informacija
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default HonoraracPopis;