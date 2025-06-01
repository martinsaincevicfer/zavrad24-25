import React, {useEffect, useState} from "react";
import axiosInstance from "../utils/axiosConfig";
import Header from "./Header";
import {Ugovor} from "../types/Ugovor";
import AxiosXHR = Axios.AxiosXHR;

const MojiUgovori: React.FC = () => {
  const [ugovori, setUgovori] = useState<Ugovor[]>([]);
  const [ucitavanje, setUcitavanje] = useState<boolean>(true);
  const [greska, setGreska] = useState<string | null>(null);

  const fetchUgovori = async () => {
    try {
      const response: AxiosXHR<Ugovor[]> = await axiosInstance.get("/ugovori/honorarac"); // Promijenite endpoint na "/api/ugovori/korisnik" ako je klijent
      setUgovori(response.data);
    } catch (error) {
      console.error("Greška pri dohvaćanju ugovora:", error);
      setGreska("Došlo je do pogreške prilikom dohvaćanja ugovora.");
    } finally {
      setUcitavanje(false);
    }
  };

  useEffect(() => {
    fetchUgovori();
  }, []);

  if (ucitavanje) return (<>
    <Header/>
    <div>Učitavanje ugovora...</div>
  </>);
  if (greska) return (<>
    <Header/>
    <div className="text-red-500">{greska}</div>
  </>);

  return (
    <>
      <Header/>
      <div className="container max-w-7xl mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">Moji ugovori</h1>
        {ugovori.length === 0 ? (
          <p>Nemate nijedan ugovor.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ugovori.map((ugovor) => (
              <div
                key={ugovor.id}
                className="p-4 border rounded-lg shadow-md"
              >
                <p>
                  <strong>Status: </strong>
                  {ugovor.status}
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
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MojiUgovori;