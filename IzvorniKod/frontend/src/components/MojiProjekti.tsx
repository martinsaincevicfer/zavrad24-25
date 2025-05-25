import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosConfig";
import { Projekt } from "../types/Projekt";
import Header from "./Header";
import { Link } from "react-router-dom";

export const MojiProjekti: React.FC = () => {
  const [projekti, setProjekti] = useState<Projekt[]>([]);
  const [ucitavanje, setUcitavanje] = useState<boolean>(true);
  const [greska, setGreska] = useState<string | null>(null);

  useEffect(() => {
    const dohvatiMojeProjekte = async () => {
      try {
        const response = await axiosInstance.get("/projekti/moji-projekti");
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
      <Header />
      <div className="container max-w-7xl mx-auto px-4 py-6">
        Učitavanje...
      </div>
    </>
  );

  if (greska) return (
    <>
      <Header />
      <div className="text-center p-4 text-red-500">
        Dogodila se greška tokom učitavanja.
      </div>
    </>
  );

  if (!projekti.length)
    return (
      <>
        <Header />
        <div className="container max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-4">Moji projekti</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-large text-center text-gray-600">
            Nemate niti jedan projekt.
          </div>
        </div>
      </>
    );

  return (
    <>
      <Header />
      <div className="container max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Moji projekti</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projekti.map((projekt) => (
            <Link
              to={`/projekti/${projekt.id}`}
              key={projekt.id}
              className="p-4 border rounded-lg bg-gray-200 dark:bg-gray-900 shadow-md hover:shadow-lg hover:border-blue-500 transition"
            >
              <h2 className="text-xl font-semibold mb-2">{projekt.naziv}</h2>
              <p className="truncate mb-4">{projekt.opis}</p>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="font-medium">Budžet: </span>€{projekt.budzet}
                </div>
                <div>
                  <span className="font-medium">Rok: </span>
                  {new Date(projekt.rok).toLocaleDateString("hr-HR")}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};