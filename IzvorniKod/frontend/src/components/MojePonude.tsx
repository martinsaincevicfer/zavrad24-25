import React, {useEffect, useState} from "react";
import axiosInstance from "../utils/axiosConfig";
import {Ponuda} from "../types/Ponuda.ts";
import Header from "./Header";


const MojePonude: React.FC = () => {
  const [ponude, setPonude] = useState<Ponuda[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPonude = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get<Ponuda[]>("/ponude/moje-ponude");
        setPonude(response.data);
      } catch (err) {
        console.error("Greška kod dohvaćanja ponude:", err);
        setError("Greška prilikom dohvaćanja ponuda. Pokušajte ponovno.");
      } finally {
        setLoading(false);
      }
    };

    fetchPonude();
  }, []);

  const formatDatum = (datum: string) => {
    return new Date(datum).toLocaleDateString("hr-HR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <>
        <Header/>
        <div className="flex justify-center items-center min-h-screen">Učitavanje...</div>
      </>
    );
  }
  if (error) {
    return (
      <>
        <Header/>
        <div className="text-red-500 flex justify-center items-center min-h-screen">{error}</div>
      </>
    );
  }

  return (
    <>
      <Header/>
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Moje ponude</h1>
        {ponude.length === 0 ? (
          <p className="text-gray-700 text-center">Nemate ponuda.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ponude.map((ponuda) => (
              <li
                key={ponuda.id}
                className="p-4 bg-gray-200 dark:bg-gray-700"
              >
                <h2 className="text-lg font-semibold">
                  Projekt: {ponuda.projekt.naziv}
                </h2>
                <p className="text-sm text-gray-400">
                  <strong>Status:</strong> {ponuda.status}
                </p>
                <p className="text-sm text-gray-400">
                  <strong>Iznos:</strong> {ponuda.iznos} €
                </p>
                <p className="text-sm text-gray-400">
                  <strong>Poruka:</strong> {ponuda.poruka}
                </p>
                <p className="text-sm text-gray-400">
                  <strong>Datum:</strong> {formatDatum(ponuda.datumStvaranja)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default MojePonude;