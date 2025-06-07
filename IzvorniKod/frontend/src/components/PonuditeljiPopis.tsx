import React from 'react';
import {Link} from 'react-router-dom';
import Header from "./Header.tsx";
import axiosInstance from "../utils/axiosConfig.ts";
import {Ponuditelj} from "../types/Ponuditelj.ts";


const PonuditeljiPopis: React.FC = () => {
  const [ponuditelji, setPonuditelji] = React.useState<Ponuditelj[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchPonuditelji = async () => {
      try {
        const response = await axiosInstance.get<Ponuditelj[]>('/ponuditelji');
        setPonuditelji(response.data);
      } catch (error) {
        console.error('Greška pri dohvaćanju profila:', error);
        setError("Greška pri dohvaćanju profila.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPonuditelji();
  }, []);

  const getPrikazanoIme = (ponuditelj: Ponuditelj) => {
    if (ponuditelj.tip === 'OSOBA') {
      return `${ponuditelj.ime} ${ponuditelj.prezime}`;
    }
    return ponuditelj.nazivTvrtke;
  };

  if (isLoading) return (
    <>
      <Header/>
      <div className="flex justify-center items-center min-h-screen">
        Učitavanje...
      </div>
    </>
  );
  if (error) return (
    <>
      <Header/>
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    </>
  );

  return (
    <>
      <Header/>
      <div className="container max-w-7xl mx-auto mt-8 px-3 sm:px-6 lg:px-9">
        <h1 className="text-3xl font-bold mb-8">Popis ponuditelja</h1>
        {ponuditelji.length === 0 ? (
          <p className="text-center">Nema dostupnih ponuditelja.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ponuditelji.map((ponuditelj) => (
              <Link
                to={`/ponuditelji/${ponuditelj.id}`}
                key={ponuditelj.id}
                className="p-4 bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-800"
              >
                <h2 className="text-xl font-bold mb-2">{getPrikazanoIme(ponuditelj)}</h2>
                <p className="mb-4">{ponuditelj.kratkiOpis}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default PonuditeljiPopis;