import React, {useEffect, useState} from "react";
import axiosInstance from "../utils/axiosConfig";
import {Rezultat} from "../types/Rezultat.ts";
import {File, Trash2} from "lucide-react";
import {authService} from "../services/authService.ts";

interface RezultatiListProps {
  ugovorId: number;
  ugovorStatus: string;
}

const RezultatiList: React.FC<RezultatiListProps> = ({ugovorId, ugovorStatus}) => {
  const [rezultati, setRezultati] = useState<Rezultat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const jeHonorarac = authService.isUserInRole('honorarac');

  useEffect(() => {
    const fetchRezultati = async () => {
      try {
        const res = await axiosInstance.get<Rezultat[]>(
          `/rezultati/by-ugovor`,
          {params: {ugovorId}}
        );
        setRezultati(res.data);
      } catch (err) {
        console.error(err);
        setError("Greška pri dohvaćanju rezultata.");
      } finally {
        setLoading(false);
      }
    };
    fetchRezultati();
  }, [ugovorId]);

  const handleDownload = async (id: number, naziv: string, datotekaUrl: string) => {
    try {
      const res = await axiosInstance.get<Blob>(`/rezultati/download/${id}`, {
        responseType: "blob",
      });
      const extMatch = datotekaUrl.match(/\.[^/.]+$/);
      const ext = extMatch ? extMatch[0] : "";
      const fileName = naziv + ext;

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Greška pri preuzimanju datoteke.");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm("Jeste li sigurni da želite obrisati ovu datoteku?");
    if (!confirmed) return;
    try {
      await axiosInstance.delete(`/rezultati/${id}`);
      setRezultati(prev => prev.filter(r => r.id !== id));
    } catch {
      alert("Greška pri brisanju datoteke.");
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
  if (rezultati.length === 0) {
    return (
      <>
        <h2 className="text-lg font-bold mb-2">Rezultati</h2>
        <div className="flex justify-center items-center">
          Nema rezultata za ovaj ugovor.
        </div>
      </>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-lg font-bold mb-2">Rezultati</h2>
      <ul className="flex flex-wrap px-1">
        {rezultati.map((rezultat) => (
          <li key={rezultat.id} className="flex items-center space-x-2">
            <button
              className="text-blue-500 underline hover:text-blue-700 flex items-center"
              onClick={() => handleDownload(rezultat.id, rezultat.naziv, rezultat.datotekaUrl)}
            >
              <File className="mr-1"/>
              {rezultat.naziv}
            </button>
            {jeHonorarac && ugovorStatus !== "zavrsen" && (
              <button
                className="text-red-500 hover:text-red-700 ml-2"
                title="Obriši"
                onClick={() => handleDelete(rezultat.id)}
              >
                <Trash2 size={18}/>
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RezultatiList;