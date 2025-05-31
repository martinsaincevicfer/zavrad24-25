import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {Projekt} from '../types/Projekt.ts';
import Header from "./Header.tsx";
import axiosInstance from "../utils/axiosConfig.ts";
import AxiosXHR = Axios.AxiosXHR;

export const ProjektPopis: React.FC = () => {
  const [projekti, setProjekti] = useState<Projekt[]>([]);
  const [ucitavanje, setUcitavanje] = useState(true);
  const [greska, setGreska] = useState<string | null>(null);

  useEffect(() => {
    const dohvatiProjekte = async () => {
      try {
        const response: AxiosXHR<Projekt[]> = await axiosInstance.get('/projekti');
        setProjekti(response.data);
      } catch (error) {
        console.error('Greška pri dohvaćanju profila:', error);
        setGreska("Greška pri dohvaćanju projekata.");
      } finally {
        setUcitavanje(false);
      }
    };

    dohvatiProjekte();
  }, []);

  if (ucitavanje) return <div className="text-center p-4">Učitavanje...</div>;
  if (greska) return <div className="text-red-500 p-4">{greska}</div>;

  return (
    <>
      <Header/>
      <div className="container max-w-7xl mx-auto mt-8 px-3 sm:px-6 lg:px-9">
        <h1 className="text-2xl font-bold mb-6">Popis projekata</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projekti.map((projekt) => (
            <div key={projekt.id} className="border rounded-lg p-4 shadow-sm">
              <h2 className="text-xl font-bold mb-2">{projekt.naziv}</h2>
              <p className="text-black dark:text-white mb-2 line-clamp-2">{projekt.opis}</p>
              <p className="text-sm mb-2">
                <span className="font-semibold">Rok:</span>{' '}
                {new Date(projekt.rok).toLocaleDateString('hr')}
              </p>
              <div className="mb-3">
                <span className="font-semibold">Potrebne vještine:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {projekt.vjestine.map((vjestina) => (
                    <span
                      key={vjestina.id}
                      className="text-black bg-blue-300 text-xs px-2 py-1 roundedbg-blue-300 rounded-full"
                    >
                    {vjestina.naziv}
                  </span>
                  ))}
                </div>
              </div>
              <Link
                to={`/projekti/${projekt.id}`}
                className="inline-block bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 text-white"
              >
                Više detalja →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};