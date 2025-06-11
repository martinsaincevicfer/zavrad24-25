import React, {useCallback, useEffect, useState} from "react";
import axiosInstance from "../utils/axiosConfig";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {authService} from "../services/authService";
import Dnevnikrada from "../types/Dnevnikrada.ts";

const dnevnikSchema = z.object({
  poruka: z.string().min(5, "Opis mora imati barem 5 znakova"),
});

type DnevnikForm = z.infer<typeof dnevnikSchema>;


interface Props {
  ugovorId: number;
}

const DnevniciRada: React.FC<Props> = ({ugovorId}) => {
  const [dnevnici, setDnevnici] = useState<Dnevnikrada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const jePonuditelj = authService.isUserInRole("ponuditelj");

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
    reset,
  } = useForm<DnevnikForm>({
    resolver: zodResolver(dnevnikSchema),
    mode: "all",
  });

  const fetchDnevnici = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get<Dnevnikrada[]>(
        `/dnevnicirada/ugovor/${ugovorId}`
      );
      setDnevnici(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Greška pri dohvaćanju dnevnika rada.");
    } finally {
      setLoading(false);
    }
  }, [ugovorId]);

  useEffect(() => {
    fetchDnevnici();
  }, [fetchDnevnici, ugovorId]);

  const onSubmit = async (data: DnevnikForm) => {
    try {
      await axiosInstance.post("/dnevnicirada/stvori", {
        ugovorId,
        ...data,
      });
      reset();
      fetchDnevnici();
    } catch (err) {
      console.error(err);
      setError("Greška pri stvaranju dnevnika rada.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Jeste li sigurni da želite obrisati dnevnik rada?")) return;
    try {
      await axiosInstance.delete(`/dnevnicirada/${id}`);
      setDnevnici((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error(err);
      setError("Greška pri brisanju dnevnika rada.");
    }
  };

  return (
    <div className="p-6 mt-4 border rounded">
      <h2 className="text-xl font-bold mb-2">Dnevnici rada</h2>
      {loading ? (
        <div>Učitavanje...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          {dnevnici.length === 0 ? (
            <div>Nema unesenih dnevnika rada.</div>
          ) : (
            <ul className="space-y-3">
              {dnevnici.map((dnevnik) => (
                <li
                  key={dnevnik.id}
                  className="border p-3 rounded flex justify-between items-center"
                >
                  <div>
                    <div>
                      <strong>Opis:</strong> {dnevnik.poruka}
                    </div>
                    <div className="text-sm text-gray-500">
                      <strong>Datum unosa:</strong>{" "}
                      {new Date(dnevnik.datumUnosa).toLocaleString()}
                    </div>
                  </div>
                  {jePonuditelj && (
                    <button
                      onClick={() => handleDelete(dnevnik.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 ml-4"
                    >
                      Obriši
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
          {jePonuditelj && (
            <form onSubmit={handleSubmit(onSubmit)} className="mb-6 space-y-4 max-w-md">
              <div>
                <label className="block font-semibold">Opis:</label>
                <textarea
                  {...register("poruka")}
                  className="border rounded px-2 py-1 w-full"
                  rows={3}
                />
                {errors.poruka && (
                  <span className="text-red-500">{errors.poruka.message}</span>
                )}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {isSubmitting ? "Spremanje..." : "Dodaj dnevnik rada"}
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default DnevniciRada;