import React, {useCallback, useEffect, useState} from "react";
import axiosInstance from "../utils/axiosConfig";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {authService} from "../services/authService";
import Dnevnikrada from "../types/Dnevnikrada.ts";
import {useConfirm} from "../utils/ConfirmContextUtils.ts";

const dnevnikSchema = z.object({
  poruka: z.string().min(5, "Opis mora imati barem 5 znakova"),
});

type DnevnikForm = z.infer<typeof dnevnikSchema>;

interface Props {
  ugovorId: number;
  ugovorStatus: string;
}

const DnevniciRada: React.FC<Props> = ({ugovorId, ugovorStatus}) => {
  const [dnevnici, setDnevnici] = useState<Dnevnikrada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const jePonuditelj = authService.isUserInRole("ponuditelj");
  const confirm = useConfirm();

  const [editId, setEditId] = useState<number | null>(null);
  const [editPoruka, setEditPoruka] = useState<string>("");

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
        poruka: data.poruka,
      });
      reset();
      fetchDnevnici();
    } catch (err) {
      console.error(err);
      setError("Greška pri stvaranju dnevnika rada.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!(await confirm({message: "Jeste li sigurni da želite obrisati dnevnik rada?"}))) return;
    try {
      await axiosInstance.delete(`/dnevnicirada/${id}`);
      setDnevnici((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error(err);
      setError("Greška pri brisanju dnevnika rada.");
    }
  };

  const handleEditClick = (dnevnik: Dnevnikrada) => {
    setEditId(dnevnik.id);
    setEditPoruka(dnevnik.poruka);
  };

  const handleEditSave = async (id: number) => {
    try {
      await axiosInstance.put(`/dnevnicirada/${id}`, {
        id,
        ugovorId,
        poruka: editPoruka,
      });
      setEditId(null);
      setEditPoruka("");
      fetchDnevnici();
    } catch (err) {
      console.error(err);
      setError("Greška pri uređivanju dnevnika rada.");
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditPoruka("");
  };

  return (
    <div className="mt-4 rounded">
      <h2 className="mb-2 font-semibold text-l md:text-xl">Dnevnik rada:</h2>
      {loading ? (
        <div>Učitavanje...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <ul>
            {dnevnici.map((dnevnik) => (
              <li key={dnevnik.id} className="mb-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                {editId === dnevnik.id ? (
                  <>
                    <input
                      type="text"
                      value={editPoruka}
                      onChange={e => setEditPoruka(e.target.value)}
                      className="w-full p-1 rounded border mb-2"
                    />
                    <button
                      onClick={() => handleEditSave(dnevnik.id)}
                      className="px-3 py-1 bg-green-500 text-white rounded mr-2"
                    >
                      Spremi
                    </button>
                    <button
                      onClick={handleEditCancel}
                      className="px-3 py-1 bg-gray-500 text-white rounded"
                    >
                      Odustani
                    </button>
                  </>
                ) : (
                  <>
                    <div>
                      <span className="font-semibold">Opis:</span> {dnevnik.poruka}
                    </div>
                    <div>
                      <span className="font-semibold">Datum unosa:</span>{" "}
                      {new Date(dnevnik.datumUnosa).toLocaleString("hr-HR")}
                    </div>
                    {jePonuditelj && ugovorStatus !== "zavrsen" && (
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleEditClick(dnevnik)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded"
                        >
                          Uredi
                        </button>
                        <button
                          onClick={() => handleDelete(dnevnik.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Obriši
                        </button>
                      </div>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
          {jePonuditelj && ugovorStatus !== "zavrsen" && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 mt-4">
              <div>
                <label className="block font-semibold">Opis:</label>
                <input
                  type="text"
                  {...register("poruka")}
                  className="border rounded px-2 py-1 w-full"
                />
                {errors.poruka && <span className="text-red-500">{errors.poruka.message}</span>}
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