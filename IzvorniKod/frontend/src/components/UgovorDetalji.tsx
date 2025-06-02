import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import Header from "./Header";
import axiosInstance from "../utils/axiosConfig";
import {Ugovor} from "../types/Ugovor.ts";

const UgovorDetalji: React.FC = () => {
  const {id} = useParams<{ id: string }>();
  const [ugovor, setUgovor] = useState<Ugovor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUgovor = async () => {
      try {
        if (!id) throw new Error("ID ugovora nije definiran.");

        const response = await axiosInstance.get<Ugovor>(
          `/ugovori/${id}`
        );
        setUgovor(response.data);
      } catch (err) {
        console.error("Greška prilikom dohvaćanja ugovora:", err);
        setError("Došlo je do pogreške prilikom dohvaćanja podataka.");
      } finally {
        setLoading(false);
      }
    };

    fetchUgovor();
  }, [id]);

  if (loading) return <div className="text-center p-4">Učitavanje...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!ugovor) return <div className="text-center p-4">Ugovor nije pronađen.</div>;

  return (
    <>
      <Header/>
      <div className="container max-w-7xl mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Detalji ugovora</h1>
        <div className="p-6 border rounded-lg shadow-lg">
          <p><strong>ID Ugovora:</strong> {ugovor.id}</p>
          <p><strong>Status:</strong> {ugovor.status}</p>
          <p>
            <strong>Datum početka:</strong>
            {new Date(ugovor.datumPocetka).toLocaleDateString()}
          </p>
          <p>
            <strong>Datum završetka:</strong>
            {ugovor.datumZavrsetka
              ? new Date(ugovor.datumZavrsetka).toLocaleDateString()
              : "N/A"}
          </p>
          <p><strong>ID Prijave:</strong> {ugovor.prijavaId}</p>
        </div>
        <div className="p-6 border-t mt-4">
          <h2 className="text-xl font-bold">Informacije o projektu</h2>
          <p><strong>Naziv:</strong> {ugovor.projekt.naziv}</p>
          <p><strong>Opis:</strong> {ugovor.projekt.opis}</p>
          <p><strong>Budžet:</strong> {ugovor.projekt.budzet}</p>
          <p><strong>Rok:</strong> {new Date(ugovor.projekt.rok).toLocaleDateString()}</p>
          <p><strong>Datum stvaranja:</strong> {new Date(ugovor.projekt.datumStvaranja).toLocaleDateString()}</p>
        </div>
      </div>
    </>
  );
};

export default UgovorDetalji;