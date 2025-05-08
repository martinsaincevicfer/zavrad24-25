import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Korisnik, Slobodnjak } from '../types/Slobodnjak.ts';
import Header from "./Header.tsx";

const SlobodnjakPopis: React.FC = () => {
  const [slobodnjaci, setSlobodnjaci] = React.useState<Slobodnjak[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchSlobodnjaci = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/slobodnjaci');
        setSlobodnjaci(response.data);
        setError(null);
      } catch (err) {
        setError('Došlo je do pogreške prilikom dohvaćanja podataka.');
        console.error('Greška:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlobodnjaci();
  }, []);

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
    <div className="max-w-7xl mx-auto">
        <Header />

      <h1 className="text-3xl font-bold mb-8">Popis Slobodnjaka</h1>
      {slobodnjaci.length === 0 ? (
        <p className="text-center">Nema dostupnih slobodnjaka.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slobodnjaci.map((slobodnjak) => (
            <div 
              key={slobodnjak.id} 
              className="rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{slobodnjak.korisnik.naziv}</h2>
              <p className="mb-4">{slobodnjak.kratkiOpis}</p>
              <Link 
                to={`/slobodnjaci/${slobodnjak.id}`}
                className="inline-block bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
              >
                Više informacija
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SlobodnjakPopis;