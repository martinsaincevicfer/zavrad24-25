import React, {useEffect} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import axiosInstance from '../utils/axiosConfig';
import {useNavigate, useParams} from 'react-router-dom';
import VjestinaAutocomplete from './VjestinaAutocomplete';
import {Projekt} from "../types/Projekt.ts";
import {Vjestina} from "../types/Vjestina.ts";
import {toast, ToastContainer} from "react-toastify";

const projektSchema = z.object({
  naziv: z.string().min(2).max(100),
  opis: z.string().min(10).max(2147483647),
  budzet: z.number().positive().min(1).max(9999999999.99),
  rokIzrade: z.string().refine((value) => !isNaN(Date.parse(value))),
  vjestine: z.array(z.number()).nonempty(),
});

type ProjektForm = z.infer<typeof projektSchema>;

const EditProjekt: React.FC = () => {
  const {id} = useParams<{ id: string }>();
  const navigate = useNavigate();

  const methods = useForm<ProjektForm>({
    resolver: zodResolver(projektSchema),
    mode: 'all',
    defaultValues: {vjestine: []},
  });

  const {register, setValue, handleSubmit, formState: {errors, isSubmitting}} = methods;

  useEffect(() => {
    const fetchProjekt = async () => {
      try {
        const res = await axiosInstance.get<Projekt>(`/projekti/${id}`);
        setValue('naziv', res.data.naziv);
        setValue('opis', res.data.opis);
        setValue('budzet', res.data.budzet);
        setValue('rokIzrade', res.data.rokIzrade.split('T')[0]);
        setValue('vjestine', res.data.vjestine.map((v: Vjestina) => v.id) as [number, ...number[]]);
      } catch {
        toast.error('Greška pri dohvaćanju projekta.');
        navigate('/korisnik/projekti');
      }
    };
    fetchProjekt();
  }, [id, setValue, navigate]);

  const onSubmit = async (data: ProjektForm) => {
    try {
      await axiosInstance.put(`/projekti/${id}`, data);
      toast.success('Projekt uspješno ažuriran!');
      navigate(`/projekti/${id}`);
    } catch (error) {
      console.error(error);
      toast.error("Dogodila se greška pri ažuriranju projekta.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 rounded">
      <ToastContainer theme="auto" position="top-center"
                      toastClassName={"text-black bg-gray-100 dark:text-white dark:bg-gray-900"}
                      limit={1}
      />
      <h1 className="text-2xl font-bold mb-6 text-center">Uredi Projekt</h1>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="naziv">Naziv projekta</label>
            <input
              type="text"
              id="naziv"
              className={`w-full p-2 border rounded ${errors.naziv ? 'border-red-500' : ''}`}
              {...register('naziv')}
            />
            {errors.naziv && <p className="text-red-500 text-sm">{errors.naziv.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="opis">Opis projekta</label>
            <textarea
              id="opis"
              rows={4}
              className={`w-full p-2 border rounded ${errors.opis ? 'border-red-500' : ''}`}
              {...register('opis')}
            />
            {errors.opis && <p className="text-red-500 text-sm">{errors.opis.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="budzet">Budžet (€)</label>
            <input
              type="number"
              id="budzet"
              className={`w-full p-2 border rounded ${errors.budzet ? 'border-red-500' : ''}`}
              {...register('budzet', {valueAsNumber: true})}
            />
            {errors.budzet && <p className="text-red-500 text-sm">{errors.budzet.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="rokIzrade">Rok za izradu projekta</label>
            <input
              type="date"
              id="rokIzrade"
              className={`w-full p-2 border rounded ${errors.rokIzrade ? 'border-red-500' : ''}`}
              {...register('rokIzrade')}
            />
            {errors.rokIzrade && <p className="text-red-500 text-sm">{errors.rokIzrade.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="vjestine">Vještine</label>
            <VjestinaAutocomplete name="vjestine"/>
            {errors.vjestine && <p className="text-red-500 text-sm">{errors.vjestine.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
          >
            Spremi promjene
          </button>
        </form>
      </FormProvider>
    </div>
  );
};

export default EditProjekt;