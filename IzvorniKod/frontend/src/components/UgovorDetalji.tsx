import React, {useCallback, useEffect, useState} from "react";
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
  ocjena: z.number({message: "Ocjena mora biti broj."}).min(1).max(5, "Ocjena mora biti između 1 i 5"),
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
  const [recenzijaStatus, setRecenzijaStatus] = useState<null | "success" | "error">(null);
  const [editMode, setEditMode] = useState(false);
  const [editOcjena, setEditOcjena] = useState<number>(1);
  const [editKomentar, setEditKomentar] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
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
      fetchUgovor();
    } catch (err) {
      console.error(err);
      setRecenzijaStatus("error");
    }
  };

  const fetchUgovor = useCallback(async () => {
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
  }, [id]);

  useEffect(() => {
    fetchUgovor();
  }, [id, fetchUgovor]);

  const zavrsiUgovor = async () => {
    try {
      await axiosInstance.patch(`/ugovori/narucitelj/zavrsi/${ugovor?.id}`);
      fetchUgovor();
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.clearWaitingQueue();
      toast.error("Greška pri završavanju ugovora.");
    }
  };

  const onEditClick = () => {
    if (ugovor?.recenzija) {
      setEditOcjena(ugovor.recenzija.ocjena);
      setEditKomentar(ugovor.recenzija.komentar);
      setEditMode(true);
    }
  };

  const handleEditSave = async () => {
    try {
      await axiosInstance.put(`/recenzije/uredi/${ugovor?.id}`, {
        ocjena: editOcjena,
        komentar: editKomentar,
        ugovorId: ugovor?.id,
      });
      toast.success("Recenzija uspješno uređena.");
      setEditMode(false);
      fetchUgovor();
    } catch (err) {
      console.error(err);
      toast.error("Greška prilikom uređivanja recenzije.");
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/recenzije/obrisi/${ugovor?.id}`);
      toast.success("Recenzija obrisana.");
      fetchUgovor();
    } catch (err) {
      console.error(err);
      toast.error("Greška prilikom brisanja recenzije.");
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
      <ToastContainer theme="auto" position="bottom-right"
                      toastClassName={"text-black bg-gray-100 dark:text-white dark:bg-gray-900"}
                      limit={1}
      />
      <div className="grid grid-cols-1 gap-2">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl md:text-4xl font-bold">Detalji ugovora</h1>
          {ugovor.status !== "zavrsen" && loggedInEmail === ugovor.projekt.narucitelj.email && (
            <div className="mt-4">
              <button
                onClick={zavrsiUgovor}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Označi ugovor kao završen
              </button>
            </div>
          )}
        </div>
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
              : "Nepoznat"}
          </span>
        </div>
        <div className="flex flex-col justify-start gap-2">
          <span className="font-semibold text-l md:text-xl">Opis:</span>
          <span
            className="text-gray-700 dark:text-gray-300 mb-6 truncate text-l md:text-xl wrap-break-word line-clamp-3 overflow-auto">{ugovor.projekt.opis}</span>
        </div>
      </div>

      <DnevniciRada ugovor={ugovor}/>

      {ugovor.status === "zavrsen" && !ugovor.recenzija && loggedInEmail === ugovor.projekt.narucitelj.email && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Ostavi recenziju</h2>
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

      {ugovor.recenzija && !editMode && (
        <div className="p-4 mt-8 bg-gray-100 dark:bg-gray-800 rounded">
          <div className="flex gap-2 justify-between items-center">
            <h2 className="text-xl font-semibold">Ostvaljena recenzija:</h2>
            {loggedInEmail === ugovor.projekt.narucitelj.email && (
              <div className="hidden md:flex gap-2">
                <button
                  onClick={onEditClick}
                  className="bg-yellow-500 text-white rounded"
                >
                  Uredi recenziju
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white rounded"
                >
                  Obriši recenziju
                </button>
              </div>
            )}
          </div>
          <div className="overflow-x-auto">
            <div>
              <span className="font-semibold">Ocjena:</span> {ugovor.recenzija.ocjena}
            </div>
            <div className="wrap-break-word line-clamp-3 overflow-auto">
              <span className="font-semibold">Komentar:</span> {ugovor.recenzija.komentar}
            </div>
          </div>
          {loggedInEmail === ugovor.projekt.narucitelj.email && (
            <div className="flex md:hidden gap-2 mt-2">
              <button
                onClick={onEditClick}
                className="bg-yellow-500 text-white rounded"
              >
                Uredi recenziju
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white rounded"
              >
                Obriši recenziju
              </button>
            </div>
          )}
        </div>
      )}

      {ugovor.recenzija && loggedInEmail === ugovor.projekt.narucitelj.email && editMode && (
        <div className="p-6 mt-4 bg-gray-100 dark:bg-gray-800 rounded">
          <div className="flex justify-between">
            <h2 className="text-xl font-bold mb-2">Uredi recenziju</h2>
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => setEditMode(false)}
                className="px-3 py-1 bg-gray-500 text-white rounded"
              >
                Odustani
              </button>
              <button
                onClick={handleEditSave}
                className="px-3 py-1 bg-green-500 text-white rounded mr-2"
              >
                Spremi
              </button>
            </div>
          </div>
          <div className="mb-2">
            <label className="block font-semibold">Ocjena (1-5):</label>
            <input
              type="number"
              min={1}
              max={5}
              value={editOcjena}
              onChange={e => setEditOcjena(Number(e.target.value))}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block font-semibold wrap-break-word line-clamp-3 overflow-auto">Komentar:</label>
            <textarea
              value={editKomentar}
              onChange={e => setEditKomentar(e.target.value)}
              className="border rounded px-2 py-1 w-full"
              rows={3}
            />
          </div>
          <div className="flex md:hidden gap-2">
            <button
              onClick={() => setEditMode(false)}
              className="px-3 py-1 bg-gray-500 text-white rounded"
            >
              Odustani
            </button>
            <button
              onClick={handleEditSave}
              className="px-3 py-1 bg-green-500 text-white rounded mr-2"
            >
              Spremi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UgovorDetalji;