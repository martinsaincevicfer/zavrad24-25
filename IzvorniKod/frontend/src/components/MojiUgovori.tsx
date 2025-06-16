import React, {useEffect, useState} from "react";
import axiosInstance from "../utils/axiosConfig";
import {Ugovor} from "../types/Ugovor";
import {authService} from "../services/authService.ts";
import {Link} from "react-router-dom";

const MojiUgovori: React.FC = () => {
  const [ugovori, setUgovori] = useState<Ugovor[]>([]);
  const [ucitavanje, setUcitavanje] = useState<boolean>(true);
  const [greska, setGreska] = useState<string | null>(null);
  const jePonuditelj = authService.isUserInRole("ponuditelj");

  useEffect(() => {
    const fetchUgovori = async () => {
      try {
        const response = await axiosInstance.get<Ugovor[]>(
          jePonuditelj ? "/ugovori/ponuditelj" : "/ugovori/korisnik"
        );
        setUgovori(response.data);
      } catch (error) {
        console.error("Greška pri dohvaćanju ugovora:", error);
        setGreska("Došlo je do pogreške prilikom dohvaćanja ugovora.");
      } finally {
        setUcitavanje(false);
      }
    };

    fetchUgovori();
  }, [jePonuditelj]);

  if (ucitavanje) return (
    <>
      <div className="flex justify-center items-center min-h-screen">Učitavanje ugovora...</div>
    </>);
  if (greska) return (
    <>
      <div className="text-red-500 flex justify-center items-center min-h-screen">{greska}</div>
    </>);

  return (
    <div className="container max-w-7xl mx-auto mt-5 px-3 sm:px-6 lg:px-9">
      <h1 className="text-xl md:text-2xl font-bold mb-6">Moji ugovori</h1>
      {ugovori.length === 0 ? (
        <p className="text-xl text-center text-gray-600">Nemate nijedan ugovor.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ugovori.map((ugovor) => (
            <Link
              to={`/ugovori/${ugovor.id}`}
              key={ugovor.id}
              className="p-4 bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-800"
            >
              <p>
                <strong>Projekt: </strong>{ugovor.projekt.naziv}
              </p>
              {jePonuditelj && (
                <p>
                  <strong>Narucitelj: </strong>
                  {ugovor.projekt.narucitelj.id}
                </p>
              )}
              {!jePonuditelj && (
                <p>
                  <strong>Ponuditelj: </strong>
                  {ugovor.ponuda.ponuditelj.ime} {ugovor.ponuda.ponuditelj.prezime} {ugovor.ponuda.ponuditelj.nazivTvrtke}
                </p>
              )}
              <p>
                <strong>Status: </strong>{ugovor.status}
              </p>
              <p>
                <strong>Datum početka: </strong>
                {new Date(ugovor.datumPocetka).toLocaleDateString()}
              </p>
              <p>
                <strong>Datum završetka: </strong>
                {ugovor.datumZavrsetka
                  ? new Date(ugovor.datumZavrsetka).toLocaleDateString()
                  : "N/A"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MojiUgovori;