import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";
import {Ugovor} from "../types/Ugovor.ts";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {authService} from "../services/authService.ts";
import DnevniciRada from "./DnevniciRada.tsx";
import {toast, ToastContainer} from "react-toastify";

const recenzijaSchema = z.object({
  ocjena: z.number().min(1).max(5, "Ocjena mora biti između 1 i 5"),
  komentar: z.string().min(5, "Komentar mora imati barem 5 znakova"),
});

type RecenzijaForm = z.infer<typeof recenzijaSchema>;

const getLoggedInUserEmail = () => authService.getCurrentUser();

const UgovorDetalji: React.FC = () => {
  const {id} = useParams<{ id: string }>();
  const [ugovor, setUgovor] = useState<Ugovor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const loggedInEmail = getLoggedInUserEmail();
  const jePonuditelj = authService.isUserInRole('ponuditelj');
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
      await axiosInstance.patch(`/ugovori/ponuditelji/zavrsi/${ugovor?.id}`);
      location.reload();
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.clearWaitingQueue();
      toast.error("Greška pri završavanju ugovora.");
    }
  };

  if (loading) {
    return (
      <>
        <div className="flex justify-center items-center min-h-screen">Učitavanje...</div>
      </>
    );
  }
  if (error) {
    return (
      <>
        <div className="text-red-500 flex justify-center items-center min-h-screen">{error}</div>
      </>
    );
  }
  if (!ugovor) {
    return (
      <>
        <div className="flex justify-center items-center min-h-screen">
          Ugovor nije pronađen.
        </div>
      </>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto mt-5 px-3 sm:px-6 lg:px-9">
      <ToastContainer theme="auto" position="top-center"
                      toastClassName={"text-black bg-gray-100 dark:text-white dark:bg-gray-900"}
                      limit={1}
      />
      <div className="grid grid-cols-1 gap-2">
        <h1 className="text-3xl md:text-4xl font-bold">Detalji ugovora</h1>
        {loggedInEmail === ugovor.projekt.narucitelj.email ? (
          <div className="flex justify-between">
            <span className="font-semibold text-l md:text-xl">Ponuditelj: </span>
            <span className="text-l md:text-xl">
              {ugovor.ponuda.ponuditelj.tip === "osoba"
                ? `${ugovor.ponuda.ponuditelj.ime ?? ""} ${ugovor.ponuda.ponuditelj.prezime ?? ""}`
                : ugovor.ponuda.ponuditelj.nazivTvrtke ?? ""}
            </span>
          </div>
        ) : (
          <div className="flex justify-between">
            <span className="font-semibold text-l md:text-xl">Naručitelj: </span>
            <span className="text-l md:text-xl">
              {ugovor.projekt.narucitelj.tip === "osoba"
                ? `${(ugovor.projekt.narucitelj as import("../types/Korisnik").Osoba).ime} ${(ugovor.projekt.narucitelj as import("../types/Korisnik").Osoba).prezime}`
                : (ugovor.projekt.narucitelj as import("../types/Korisnik").Tvrtka).nazivTvrtke}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="font-semibold text-l md:text-xl">Status:</span>
          <span className="text-l md:text-xl">{ugovor.status}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-l md:text-xl">Budžet:</span>
          <span className="text-l md:text-xl">{ugovor.projekt.budzet}€</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-l md:text-xl">Rok izrade:</span>
          <span className="text-l md:text-xl">{new Date(ugovor.projekt.rokIzrade).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-l md:text-xl">Datum početka:</span>
          <span className="text-l md:text-xl">{new Date(ugovor.datumPocetka).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-l md:text-xl">Datum završetka:</span>
          <span className="text-l md:text-xl">
            {ugovor.datumZavrsetka
              ? new Date(ugovor.datumZavrsetka).toLocaleDateString()
              : "N/A"}
          </span>
        </div>
        <div className="flex flex-col justify-start gap-2">
          <span className="font-semibold text-l md:text-xl">Opis:</span>
          <span
            className="text-gray-700 dark:text-gray-300 mb-6 truncate text-l md:text-xl">{ugovor.projekt.opis}</span>
        </div>
      </div>

      {!jePonuditelj && ugovor.status !== "zavrsen" && (
        <div className="mt-4">
          <button
            onClick={zavrsiUgovor}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Označi ugovor kao završen
          </button>
        </div>
      )}

      <DnevniciRada ugovorId={ugovor.id} ugovorStatus={ugovor.status}/>

      {ugovor.status === "zavrsen" && !ugovor.recenzija && !jePonuditelj && (
        <div className="p-6 mt-4">
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
  );
};

export default UgovorDetalji;