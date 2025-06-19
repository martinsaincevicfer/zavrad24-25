import React, {useState} from 'react';
import {Ponuda} from '../types/Ponuda';
import {Link} from 'react-router-dom';
import {authService} from "../services/authService.ts";
import {Korisnik} from "../types/Korisnik.ts";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

const editPonudaSchema = z.object({
  iznos: z.number().min(1, "Iznos mora biti veći od 0"),
  poruka: z.string().min(1, "Poruka je obavezna"),
});

type EditPonudaForm = z.infer<typeof editPonudaSchema>;

interface PonudaPopisProps {
  ponude: Ponuda[];
  formatDatum: (datum: string) => string;
  onPrihvatiPonudu: (ponudaId: number) => Promise<void>;
  korisnik: Korisnik | null;
  onDeletePonuda: (ponudaId: number) => void;
  onSaveEditPonuda?: (ponudaId: number, data: EditPonudaForm) => Promise<void>; // Add this prop
}

const PonudaPopis: React.FC<PonudaPopisProps> = ({
                                                   ponude,
                                                   formatDatum,
                                                   onPrihvatiPonudu,
                                                   korisnik,
                                                   onDeletePonuda,
                                                   onSaveEditPonuda,
                                                 }) => {
  const ulogiraniKorisnik = authService.getCurrentUser();
  const [editPonudaId, setEditPonudaId] = useState<number | null>(null);

  return (
    <div>
      <h2 className="text-l md:text-xl font-bold mb-4">Ponude za projekt</h2>
      {ponude.length === 0 ? (
        <p>Trenutno nema ponuda za ovaj projekt.</p>
      ) : (
        <ul className="space-y-4 h-1/6 md:h-1/5 overflow-y-scroll">
          {ponude.map((ponuda) => {
            const isEditing = editPonudaId === ponuda.id;
            return (
              <div
                key={ponuda.id}
                className="flex flex-col md:flex-row gap-5 items-start justify-between border rounded-lg p-3 text-l bg-gray-100 dark:bg-gray-800"
              >
                <li className="mt-0 pt-0 overflow-x-auto w-full">
                  <Link
                    to={`/ponuditelji/${ponuda.ponuditelj.id}`}
                    className="text-blue-500 hover:text-blue-600 text-xl text-center"
                  >
                    {ponuda.ponuditelj.ime} {ponuda.ponuditelj.prezime} {ponuda.ponuditelj.nazivTvrtke} ({ponuda.ponuditelj.email})
                  </Link>
                  {isEditing ? (
                    <EditPonudaFormComponent
                      defaultValues={{iznos: ponuda.iznos, poruka: ponuda.poruka}}
                      onSubmit={async (data) => {
                        if (onSaveEditPonuda) {
                          await onSaveEditPonuda(ponuda.id, data);
                          setEditPonudaId(null);
                        }
                      }}
                      onCancel={() => setEditPonudaId(null)}
                    />
                  ) : (
                    <>
                      <p className="text-m md:text-l">
                        <strong className="text-m md:text-l">Iznos:</strong> {ponuda.iznos} €
                      </p>
                      <p className="text-m md:text-l w-full overflow-y-scroll overflow-x-auto">
                        <strong className="text-m md:text-l">Poruka:</strong> {ponuda.poruka}
                      </p>
                      <p className="text-m md:text-l">
                        <strong className="text-m md:text-l">Datum slanja
                          ponude:</strong> {formatDatum(ponuda.datumStvaranja)}
                      </p>
                      <p className="text-m md:text-l">
                        <strong className="text-m md:text-l">Rok za prihvaćanje
                          ponude:</strong> {formatDatum(ponuda.rokZaPrihvacanje)}
                      </p>
                    </>
                  )}
                  {ponuda.status === 'aktivna' && (ulogiraniKorisnik === korisnik?.email) && !isEditing && (
                    <button
                      onClick={() => onPrihvatiPonudu(ponuda.id)}
                      className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Prihvati ponudu
                    </button>
                  )}
                </li>
                {ponuda.ponuditelj.email === ulogiraniKorisnik && ponuda.status !== 'prihvacena' && !isEditing && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditPonudaId(ponuda.id)}
                      className="bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Uredi
                    </button>
                    <button
                      onClick={() => onDeletePonuda(ponuda.id)}
                      className="bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Obriši
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </ul>
      )}
    </div>
  );
};

interface EditPonudaFormComponentProps {
  defaultValues: EditPonudaForm;
  onSubmit: (data: EditPonudaForm) => void;
  onCancel: () => void;
}

const EditPonudaFormComponent: React.FC<EditPonudaFormComponentProps> = ({defaultValues, onSubmit, onCancel}) => {
  const {register, handleSubmit, formState: {errors}} = useForm<EditPonudaForm>({
    defaultValues,
    resolver: zodResolver(editPonudaSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-2">
      <div className="mb-2">
        <label className="block text-sm">Iznos (€):</label>
        <input
          type="number"
          step="0.01"
          {...register("iznos", {valueAsNumber: true})}
          className="w-full p-1 rounded border"
        />
        {errors.iznos && <span className="text-red-500 text-xs">{errors.iznos.message}</span>}
      </div>
      <div className="mb-2">
        <label className="block text-sm">Poruka:</label>
        <textarea
          {...register("poruka")}
          className="w-full p-1 rounded border"
          rows={3}
        />
        {errors.poruka && <span className="text-red-500 text-xs">{errors.poruka.message}</span>}
      </div>
      <button
        type="button"
        onClick={onCancel}
        className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded mr-2"
      >
        Odustani
      </button>
      <button
        type="submit"
        className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
      >
        Spremi
      </button>
    </form>
  );
};

export default PonudaPopis;