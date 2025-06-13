import React, {useEffect, useState} from "react";
import axiosInstance from "../utils/axiosConfig";
import {Ponuda} from "../types/Ponuda.ts";

const MojePonude: React.FC = () => {
  const [ponude, setPonude] = useState<Ponuda[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editPonudaId, setEditPonudaId] = useState<number | null>(null);
  const [editIznos, setEditIznos] = useState<number>(0);
  const [editPoruka, setEditPoruka] = useState<string>("");

  useEffect(() => {
    fetchPonude();
  }, []);

  const fetchPonude = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get<Ponuda[]>("/ponude/moje-ponude");
      setPonude(response.data);
    } catch (err) {
      console.error(err);
      setError("Greška prilikom dohvaćanja ponuda. Pokušajte ponovno.");
    } finally {
      setLoading(false);
    }
  };

  const formatDatum = (datum: string) => {
    return new Date(datum).toLocaleDateString("hr-HR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleEditClick = (ponuda: Ponuda) => {
    setEditPonudaId(ponuda.id);
    setEditIznos(ponuda.iznos);
    setEditPoruka(ponuda.poruka);
  };

  const handleEditSave = async (ponudaId: number) => {
    try {
      await axiosInstance.put(`/ponude/${ponudaId}`, {
        iznos: editIznos,
        poruka: editPoruka,
      });
      setEditPonudaId(null);
      fetchPonude();
    } catch (err) {
      console.error(err);
      alert("Greška prilikom uređivanja ponude.");
    }
  };

  const handleDelete = async (ponudaId: number) => {
    if (!window.confirm("Jeste li sigurni da želite obrisati ovu ponudu?")) return;
    try {
      await axiosInstance.delete(`/ponude/${ponudaId}`);
      fetchPonude();
    } catch (err) {
      console.error(err);
      alert("Greška prilikom brisanja ponude.");
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

  return (
    <>
      <div className="max-w-8xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Moje ponude</h1>
        {ponude.length === 0 ? (
          <p className="text-gray-700 text-center">Nemate ponuda.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ponude.map((ponuda) => (
              <li key={ponuda.id} className="p-4 bg-gray-200 dark:bg-gray-700">
                <h2 className="text-lg font-semibold">
                  Projekt: {ponuda.projekt.naziv}
                </h2>
                <p className="text-sm text-gray-400">
                  <strong>Status:</strong> {ponuda.status}
                </p>
                {editPonudaId === ponuda.id ? (
                  <>
                    <div className="mb-2">
                      <label className="block text-sm">Iznos (€):</label>
                      <input
                        type="number"
                        value={editIznos}
                        onChange={e => setEditIznos(Number(e.target.value))}
                        className="w-full p-1 rounded"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block text-sm">Poruka:</label>
                      <input
                        type="text"
                        value={editPoruka}
                        onChange={e => setEditPoruka(e.target.value)}
                        className="w-full p-1 rounded"
                      />
                    </div>
                    <button
                      onClick={() => handleEditSave(ponuda.id)}
                      className="px-3 py-1 bg-green-500 text-white rounded mr-2"
                    >
                      Spremi
                    </button>
                    <button
                      onClick={() => setEditPonudaId(null)}
                      className="px-3 py-1 bg-gray-500 text-white rounded"
                    >
                      Odustani
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-400">
                      <strong>Iznos:</strong> {ponuda.iznos} €
                    </p>
                    <p className="text-sm text-gray-400">
                      <strong>Poruka:</strong> {ponuda.poruka}
                    </p>
                    <p className="text-sm text-gray-400">
                      <strong>Datum:</strong> {formatDatum(ponuda.datumStvaranja)}
                    </p>
                    {ponuda.status !== "prihvacena" && (
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => handleEditClick(ponuda)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                          Uredi
                        </button>
                        <button
                          onClick={() => handleDelete(ponuda.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
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
        )}
      </div>
    </>
  );
};

export default MojePonude;