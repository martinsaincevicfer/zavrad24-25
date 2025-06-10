import React from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import axiosInstance from '../utils/axiosConfig';
import Header from './Header';
import {useNavigate} from 'react-router-dom';
import VjestinaAutocomplete from "./VjestinaAutocomplete.tsx";

const projektSchema = z.object({
  naziv: z
    .string()
    .min(2, 'Naziv projekta mora sadržavati najmanje 2 znaka.')
    .max(100, 'Naziv projekta može imati najviše 100 znakova.'),
  opis: z
    .string()
    .min(10, 'Opis projekta mora sadržavati najmanje 10 znakova.')
    .max(2147483647, 'Opis projekta je predugačak.'),
  budzet: z
    .number({invalid_type_error: 'Budžet mora biti broj.'})
    .positive('Iznos mora biti pozitivan broj.')
    .min(1, 'Budžet mora biti veći od 0.')
    .max(9999999999.99, 'Budžet prelazi maksimalnu dozvoljenu vrijednost.'),
  rokIzrade: z
    .string()
    .refine((value) => !isNaN(Date.parse(value)), {message: 'Datum roka mora biti ispravan.'}),
  vjestine: z.array(z.number()).nonempty('Morate odabrati barem jednu vještinu.')
});

type ProjektForm = z.infer<typeof projektSchema>;

const KreiranjeProjekta: React.FC = () => {
  const navigate = useNavigate();

  const methods = useForm<ProjektForm>({
    resolver: zodResolver(projektSchema),
    mode: 'all',
    defaultValues: {
      vjestine: []
    }
  });

  const {register, formState: {errors}} = methods;

  const onSubmit = async (data: ProjektForm) => {
    try {
      await axiosInstance.post('/projekti/stvori', data);
      alert('Projekt uspješno kreiran!');
      navigate('/korisnik/projekti');
    } catch (error) {
      console.error('Greška prilikom kreiranja projekta:', error);
      alert('Došlo je do greške. Pokušajte ponovno.');
    }
  };

  return (
    <>
      <Header/>
      <div className="max-w-4xl mx-auto p-6 rounded">
        <h1 className="text-2xl font-bold mb-6 text-center">Kreiraj Novi Projekt</h1>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="naziv">
                Naziv projekta
              </label>
              <input
                type="text"
                id="naziv"
                className={`w-full p-2 border rounded ${errors.naziv ? 'border-red-500' : ''}`}
                {...register('naziv')}
              />
              {errors.naziv && <p className="text-red-500 text-sm">{errors.naziv.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="opis">
                Opis projekta
              </label>
              <textarea
                id="opis"
                rows={4}
                className={`w-full p-2 border rounded ${errors.opis ? 'border-red-500' : ''}`}
                {...register('opis')}
              />
              {errors.opis && <p className="text-red-500 text-sm">{errors.opis.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="budzet">
                Budžet (€)
              </label>
              <input
                type="number"
                id="budzet"
                className={`w-full p-2 border rounded ${errors.budzet ? 'border-red-500' : ''}`}
                {...register('budzet', {valueAsNumber: true})}
              />
              {errors.budzet && <p className="text-red-500 text-sm">{errors.budzet.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="rokIzrade">
                Rok za izradu projekta
              </label>
              <input
                type="date"
                id="rokIzrade"
                className={`w-full p-2 border rounded ${errors.rokIzrade ? 'border-red-500' : ''}`}
                {...register('rokIzrade')}
              />
              {errors.rokIzrade && <p className="text-red-500 text-sm">{errors.rokIzrade.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="vjestine">
                Predložene vještine
              </label>
              <VjestinaAutocomplete name="vjestine"/>
              {errors.vjestine && (
                <p className="text-red-500 text-sm mt-1">{errors.vjestine.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Kreiraj Projekt
            </button>
          </form>
        </FormProvider>
      </div>
    </>
  );
};

export default KreiranjeProjekta;