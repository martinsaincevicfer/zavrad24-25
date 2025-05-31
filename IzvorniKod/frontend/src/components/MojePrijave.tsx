import React, {useEffect, useState} from "react";
import axiosInstance from "../utils/axiosConfig";
import {PrijavaDTO} from "../types/PrijavaDTO";
import Header from "./Header";
import AxiosXHR = Axios.AxiosXHR;

const MojePrijave: React.FC = () => {
  const [prijave, setPrijave] = useState<PrijavaDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrijave = async () => {
      try {
        setLoading(true);
        const response: AxiosXHR<PrijavaDTO[]> = await axiosInstance.get("/prijave/moje-prijave");
        setPrijave(response.data);
      } catch (err) {
        console.error("Greška kod dohvaćanja prijava:", err);
        setError("Greška prilikom dohvaćanja prijava. Pokušajte ponovno.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrijave();
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
        <div className="text-center p-4">Učitavanje...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header/>
        <div className="text-red-500 text-center p-4">{error}</div>
      </>
    );
  }

  return (
    <>
      <Header/>
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Moje Prijave</h1>
        {prijave.length === 0 ? (
          <p className="text-gray-700 text-center">Nemate prijava.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {prijave.map((prijava) => (
              <li
                key={prijava.id}
                className="border rounded-lg shadow p-4"
              >
                <h2 className="text-lg font-semibold">
                  Projekt: {prijava.projekt.naziv}
                </h2>
                <p className="text-sm text-gray-400">
                  <strong>Status:</strong> {prijava.status}
                </p>
                <p className="text-sm text-gray-400">
                  <strong>Iznos:</strong> {prijava.iznos} €
                </p>
                <p className="text-sm text-gray-400">
                  <strong>Poruka:</strong> {prijava.poruka}
                </p>
                <p className="text-sm text-gray-400">
                  <strong>Datum:</strong> {formatDatum(prijava.datumStvaranja)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default MojePrijave;