import React, {useEffect, useState} from 'react';
import axiosInstance from '../utils/axiosConfig';
import {Vjestina} from "../types/Vjestina.ts";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useConfirm} from "../utils/ConfirmContextUtils.ts";

const vjestinaSchema = z.object({
  naziv: z.string().min(2, "Naziv je obavezan").max(100, "Naziv je predugačak"),
  kategorija: z.string().min(2, "Kategorija je obavezna").max(100, "Kategorija je predugačka"),
});
type VjestinaForm = z.infer<typeof vjestinaSchema>;

const AdminPanel: React.FC = () => {
  const [vjestine, setVjestine] = useState<Vjestina[]>([]);
  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const confirm = useConfirm();

  const {
    register: createRegister,
    handleSubmit: handleCreateSubmit,
    reset: createReset,
    formState: {errors: createErrors, isSubmitting: isCreateSubmitting}
  } = useForm<VjestinaForm>({
    resolver: zodResolver(vjestinaSchema),
    defaultValues: {naziv: '', kategorija: ''},
  });

  const {
    register: editRegister,
    handleSubmit: handleEditSubmit,
    reset: editReset,
    setValue: editSetValue,
    formState: {errors: editErrors, isSubmitting: isEditSubmitting}
  } = useForm<VjestinaForm>({
    resolver: zodResolver(vjestinaSchema),
    defaultValues: {naziv: '', kategorija: ''},
  });

  const fetchVjestine = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get<Vjestina[]>('/vjestine/all');
      setVjestine(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVjestine();
  }, []);

  const openCreate = () => {
    if (formOpen) {
      setFormOpen(false);
      createReset();
    } else {
      setFormOpen(true);
      createReset();
    }
  };

  const onCreateSubmit = async (data: VjestinaForm) => {
    await axiosInstance.post('/vjestine', data);
    setFormOpen(false);
    createReset();
    fetchVjestine();
  };

  const handleDelete = async (id: number) => {
    if (!(await confirm({message: 'Jeste li sigurni da želite obrisati ovu vještinu?'}))) return;
    await axiosInstance.delete(`/vjestine/${id}`);
    fetchVjestine();
  };

  const startEdit = (v: Vjestina) => {
    setEditId(v.id);
    editSetValue('naziv', v.naziv);
    editSetValue('kategorija', v.kategorija);
  };

  const cancelEdit = () => {
    setEditId(null);
    editReset();
  };

  const onEditSubmit = async (data: VjestinaForm) => {
    if (editId == null) return;
    await axiosInstance.put(`/vjestine/${editId}`, data);
    setEditId(null);
    editReset();
    fetchVjestine();
  };

  return (
    <div className="p-6">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Popis vještina</h2>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={openCreate}
          >
            Nova vještina
          </button>
        </div>

        {formOpen && (
          <form
            onSubmit={handleCreateSubmit(onCreateSubmit)}
            className="bg-gray-200 dark:bg-gray-900 p-6 rounded shadow-md min-w-[300px] flex flex-col gap-4 mb-6 border"
          >
            <h3 className="text-lg font-bold mb-2">Nova vještina</h3>
            <div>
              <input
                type="text"
                placeholder="Naziv"
                {...createRegister('naziv')}
                className={`border p-2 rounded w-full ${createErrors.naziv ? 'border-red-500' : ''}`}
              />
              {createErrors.naziv && <p className="text-red-500 text-sm">{createErrors.naziv.message}</p>}
            </div>
            <div>
              <input
                type="text"
                placeholder="Kategorija"
                {...createRegister('kategorija')}
                className={`border p-2 rounded w-full ${createErrors.kategorija ? 'border-red-500' : ''}`}
              />
              {createErrors.kategorija && <p className="text-red-500 text-sm">{createErrors.kategorija.message}</p>}
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="submit"
                disabled={isCreateSubmitting}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
              >
                Spremi
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div>Učitavanje...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="uppercase bg-gray-200 dark:bg-gray-900 dark:text-white">
              <tr>
                <th className="px-4 py-2">Naziv</th>
                <th className="px-4 py-2">Kategorija</th>
                <th className="px-4 py-2">Akcije</th>
              </tr>
              </thead>
              <tbody>
              {vjestine.map(v => (
                <tr key={v.id}>
                  {editId === v.id ? (
                    <>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          {...editRegister('naziv')}
                          className={`border p-2 rounded w-full ${editErrors.naziv ? 'border-red-500' : ''}`}
                        />
                        {editErrors.naziv && <p className="text-red-500 text-sm">{editErrors.naziv.message}</p>}
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          {...editRegister('kategorija')}
                          className={`border p-2 rounded w-full ${editErrors.kategorija ? 'border-red-500' : ''}`}
                        />
                        {editErrors.kategorija &&
                          <p className="text-red-500 text-sm">{editErrors.kategorija.message}</p>}
                      </td>
                      <td className="px-4 py-2 flex gap-2">
                        <button
                          className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                          onClick={cancelEdit}
                          type="button"
                        >
                          Odustani
                        </button>
                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                          onClick={handleEditSubmit(onEditSubmit)}
                          disabled={isEditSubmitting}
                        >
                          Spremi
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-2">{v.naziv}</td>
                      <td className="px-4 py-2">{v.kategorija}</td>
                      <td className="px-4 py-2 flex gap-2">
                        <button
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                          onClick={() => startEdit(v)}
                        >
                          Uredi
                        </button>
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          onClick={() => handleDelete(v.id)}
                        >
                          Obriši
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;