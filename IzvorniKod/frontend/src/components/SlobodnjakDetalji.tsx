import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Korisnik, Slobodnjak } from '../types/Slobodnjak.ts';
import Header from "./Header.tsx";

const SlobodnjakDetalji: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [slobodnjak, setSlobodnjak] = React.useState<Slobodnjak | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchSlobodnjak = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/slobodnjaci/${id}`);
        setSlobodnjak(response.data);
        setError(null);
      } catch (err) {
        setError('Došlo je do pogreške prilikom dohvaćanja podataka.');
        console.error('Greška:', err);
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
    <div className="max-w-4xl mx-auto">
        <Header />

      <div className="rounded-lg shadow-md p-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">O meni</h2>
            <p>{slobodnjak.kratkiOpis}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Edukacija</h2>
            <p>{slobodnjak.edukacija}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Iskustvo</h2>
            <p>{slobodnjak.iskustvo}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Kontakt</h2>
            <p>{slobodnjak.korisnik.email}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Datum registracije</h2>
            <p>
              {new Date(slobodnjak.datumStvaranja).toLocaleDateString('hr-HR')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlobodnjakDetalji;