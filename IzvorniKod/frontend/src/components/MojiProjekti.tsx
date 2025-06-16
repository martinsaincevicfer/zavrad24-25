import React, {useEffect, useState} from "react";
import axiosInstance from "../utils/axiosConfig";
import {Projekt} from "../types/Projekt";
import {Link} from "react-router-dom";


export const MojiProjekti: React.FC = () => {
  const [projekti, setProjekti] = useState<Projekt[]>([]);
  const [ucitavanje, setUcitavanje] = useState<boolean>(true);
  const [greska, setGreska] = useState<string | null>(null);

  useEffect(() => {
    const dohvatiMojeProjekte = async () => {
      try {
        const response = await axiosInstance.get<Projekt[]>("/projekti/moji-projekti");
        setProjekti(response.data);
      } catch (error) {
        console.error("Greška pri dohvaćanju projekata:", error);
        setGreska("Došlo je do pogreške prilikom dohvaćanja projekata.");
      } finally {
        setUcitavanje(false);
      }
    };

    dohvatiMojeProjekte();
  }, []);

  if (ucitavanje) return (
    <>
      <div className="flex justify-center items-center min-h-screen">
        Učitavanje...
      </div>
    </>
  );
  if (greska) return (
    <>
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {greska}
      </div>
    </>
  );

  if (!projekti.length)
    return (
      <>
        <div className="container max-w-7xl mx-auto mt-5 px-3 sm:px-6 lg:px-9">
          <h1 className="text-2xl font-bold mb-4">Moji projekti</h1>
          <div className="text-xl text-center text-gray-600">
            Nemate niti jedan projekt.
          </div>
        </div>
      </>
    );

  return (
    <div className="container max-w-7xl mx-auto mt-5 px-3 sm:px-6 lg:px-9">
      <h1 className="text-xl md:text-2xl font-bold mb-6">Moji projekti</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projekti.map((projekt) => (
          <Link
            to={`/projekti/${projekt.id}`}
            key={projekt.id}
            className="p-4 bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-800"
          >
            <h2 className="text-xl font-semibold mb-2">{projekt.naziv}</h2>
            <p className="truncate mb-4">{projekt.opis}</p>
            <div className="space-y-1 text-sm">
              <div>
                <span className="font-medium">Budžet: </span>€{projekt.budzet}
              </div>
              <div>
                <span className="font-medium">Rok izrade: </span>
                {new Date(projekt.rokIzrade).toLocaleDateString("hr-HR")}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};