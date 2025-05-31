import React, {useEffect, useState} from "react";
import axios from "../utils/axiosConfig";
import {PonudaDTO} from "../types/PonudaDTO";
import Header from "./Header";
import AxiosXHR = Axios.AxiosXHR;

const KorisnikPonude: React.FC = () => {
  const [ponude, setPonude] = useState<PonudaDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPonude = async () => {
      try {
        const response: AxiosXHR<PonudaDTO[]> = await axios.get("/ponude/klijent/sve");
        setPonude(response.data);
      } catch (err) {
        setError("Greška prilikom dohvaćanja ponuda.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPonude();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Učitavanje ponuda...</div>
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
      <Header/>
      <div className="container max-w-7xl mx-auto mt-8 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Poslane ponude</h1>
        {ponude.length === 0 ? (
          <p className="text-center">Trenutno nema poslanih ponuda za prikaz.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ponude.map((ponuda) => (
              <div
                key={ponuda.id}
                className="border rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-bold mb-2">{ponuda.naziv}</h2>
                <p className="text-gray-300 mb-2">{ponuda.opis}</p>
                <p className="font-semibold mb-2">
                  Budžet:{" "}
                  <span className="text-blue-500">
                    {ponuda.budzet?.toLocaleString("hr-HR", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </span>
                </p>
                <p className="mb-2">Rok: {ponuda.rok}</p>
                <p className="mb-4">Status: {ponuda.status}</p>
                <p className="text-sm text-gray-500">
                  Poslano:{" "}
                  {new Date(ponuda.datumStvaranja).toLocaleDateString("hr-HR")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default KorisnikPonude;