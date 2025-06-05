import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import Header from "./Header";
import axiosInstance from "../utils/axiosConfig";
import {Ugovor} from "../types/Ugovor.ts";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {authService} from "../services/authService.ts";
import RezultatUploadForm from "./RezultatUploadForm.tsx";
import RezultatiList from "./RezultatiList.tsx";

const recenzijaSchema = z.object({
  ocjena: z.number().min(1).max(5, "Ocjena mora biti između 1 i 5"),
  komentar: z.string().min(5, "Komentar mora imati barem 5 znakova"),
});

type RecenzijaForm = z.infer<typeof recenzijaSchema>;

const UgovorDetalji: React.FC = () => {
  const {id} = useParams<{ id: string }>();
  const [ugovor, setUgovor] = useState<Ugovor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const jeHonorarac = authService.isUserInRole('honorarac');
  const [recenzijaStatus, setRecenzijaStatus] = useState<null | "success" | "error">(null);
  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
    reset
  } = useForm<RecenzijaForm>({
    resolver: zodResolver(recenzijaSchema),
    mode: "all"
  });

  const onSubmitRecenzija = async (data: RecenzijaForm) => {
    try {
      await axiosInstance.post("/recenzije/stvori", {
        ugovorId: ugovor?.id,
        ...data,
      });
      setRecenzijaStatus("success");
      reset();
      location.reload();
    } catch (err) {
      console.error(err);
      setRecenzijaStatus("error");
    }
  };

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

  const zavrsiUgovor = async () => {
    try {
      await axiosInstance.patch(`/ugovori/honorarac/zavrsi/${ugovor?.id}`);
      location.reload();
    } catch (err) {
      console.error(err);
      alert("Greška pri završavanju ugovora.");
    }
  };

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
        
        <RezultatiList ugovorId={ugovor.id} ugovorStatus={ugovor.status}/>

        {jeHonorarac && ugovor.status !== "zavrsen" && (
          <RezultatUploadForm ugovorId={ugovor.id}/>
        )}

        {jeHonorarac && ugovor.status !== "zavrsen" && (
          <div className="mt-4">
            <button
              onClick={zavrsiUgovor}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Označi ugovor kao završen
            </button>
          </div>
        )}

        {ugovor.status === "zavrsen" && !ugovor.recenzija && !jeHonorarac && (
          <div className="p-6 border-t mt-4">
            <h2 className="text-xl font-bold mb-2">Dodaj recenziju</h2>
            <form onSubmit={handleSubmit(onSubmitRecenzija)} className="space-y-4 max-w-md">
              <div>
                <label className="block font-semibold">Ocjena (1-5):</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  {...register("ocjena", {valueAsNumber: true})}
                  className="border rounded px-2 py-1 w-full"
                />
                {errors.ocjena && <span className="text-red-500">{errors.ocjena.message}</span>}
              </div>
              <div>
                <label className="block font-semibold">Komentar:</label>
                <textarea
                  {...register("komentar")}
                  className="border rounded px-2 py-1 w-full"
                  rows={3}
                />
                {errors.komentar && <span className="text-red-500">{errors.komentar.message}</span>}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {isSubmitting ? "Slanje..." : "Pošalji recenziju"}
              </button>
              {recenzijaStatus === "success" && (
                <div className="text-green-600 mt-2">Recenzija uspješno poslana!</div>
              )}
              {recenzijaStatus === "error" && (
                <div className="text-red-600 mt-2">Greška pri slanju recenzije.</div>
              )}
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default UgovorDetalji;