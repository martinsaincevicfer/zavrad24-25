import React, {useCallback, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {Projekt} from '../types/Projekt.ts';
import axiosInstance from "../utils/axiosConfig.ts";
import {FormProvider, useForm} from "react-hook-form";
import VjestinaAutocomplete from "./VjestinaAutocomplete.tsx";
import debounce from "lodash/debounce";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

type SearchForm = {
  naziv: string;
  budzet: number | '';
  rokIzrade?: string | undefined;
  vjestine?: number[] | undefined;
};

const searchFormSchema = z.object({
  naziv: z.string().max(100, "Naziv je predugačak"),
  budzet: z.union([z.number({invalid_type_error: 'Budžet mora biti broj.'}).min(0, "Budžet ne može biti negativan"), z.literal('')]),
  rokIzrade: z.string().optional(),
  vjestine: z.array(z.number()).optional(),
});

const formatNovac = (iznos: number) =>
  new Intl.NumberFormat('hr-HR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(iznos);

export const ProjektPopis: React.FC = () => {
  const [projekti, setProjekti] = useState<Projekt[]>([]);
  const [ucitavanje, setUcitavanje] = useState(true);
  const [greska, setGreska] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const methods = useForm<SearchForm>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {naziv: '', budzet: '', rokIzrade: '', vjestine: []},
    mode: "all"
  });

  const fetchData = useCallback(async (data: SearchForm) => {
    setGreska(null);
    try {
      const params: Record<string, string | number> = {};
      if (data.naziv.trim() !== '') params.naziv = data.naziv;
      if (data.budzet) params.budzet = data.budzet;
      if (data.rokIzrade && data.rokIzrade !== '') params.rokIzrade = data.rokIzrade;
      if (data.vjestine && data.vjestine.length > 0) params.vjestine = data.vjestine.join(',');

      const res = await axiosInstance.get<Projekt[]>('/projekti/search', {params});
      setProjekti(res.data);
    } catch (e) {
      console.error(e);
      setGreska('Greška pri pretraživanju projekata.');
    } finally {
      setUcitavanje(false);
    }
  }, []);

  const fetchDataRef = React.useRef(fetchData);

  useEffect(() => {
    fetchDataRef.current = fetchData;
  }, [fetchData]);

  const debouncedFetchDataRef = React.useRef(
    debounce((data: SearchForm) => fetchDataRef.current(data), 500)
  );

  useEffect(() => {
    const subscription = methods.watch((values) => {
      debouncedFetchDataRef.current(values as SearchForm);
    });
    setUcitavanje(true);
    fetchData(methods.getValues());
    return () => subscription.unsubscribe();
  }, [fetchData, methods]);

  if (ucitavanje) return <>
    <div className="flex justify-center items-center min-h-screen">
      Učitavanje...
    </div>
  </>;
  if (greska) return <>
    <div className="flex justify-center items-center min-h-screen text-red-500 p-4">
      {greska}
    </div>
  </>;

  return (
    <div className="container max-w-7xl mx-auto mt-5 px-3 sm:px-6 lg:px-9">
      <h1 className="text-xl md:text-2xl font-bold mb-6">Popis projekata</h1>
      <FormProvider {...methods}>
        <form
          onSubmit={e => e.preventDefault()}
          className="space-y-4 mb-8">
          <div className="flex gap-2 items-center">
            <input
              {...methods.register('naziv')}
              type="text"
              placeholder="Naziv projekta"
              className="w-6/10 md:w-22/25 p-2 border rounded"
            />
            <button
              type="button"
              className="bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              onClick={() => setShowFilters(f => !f)}
            >
              {showFilters ? 'Sakrij filtere' : 'Prikaži filtere'}
            </button>
          </div>
          {showFilters && (
            <div
              className="flex flex-col sm:flex-row items-stretch justify-around gap-2 p-4 rounded-lg bg-gray-200 dark:bg-gray-900">
              <div className="flex flex-col w-full md:w-1/4">
                <span className="mb-2">Minimalni budžet</span>
                <input
                  {...methods.register('budzet')}
                  type="number"
                  placeholder="Minimalni budžet"
                  className="p-2 border rounded"
                  min={0}
                />
              </div>
              <div className="flex flex-col w-full md:w-1/4">
                <span className="mb-2">Minimalni rok izrade</span>
                <input
                  {...methods.register('rokIzrade')}
                  type="date"
                  className="p-2 border rounded"
                />
              </div>
              <div className="flex flex-col w-full md:w-1/4">
                <span className="mb-2">Odabrane vještine</span>
                <VjestinaAutocomplete name="vjestine"/>
              </div>
              <div className="flex flex-col justify-end items-center w-full sm:w-auto">
                <button
                  type="button"
                  className="bg-gray-400 text-white rounded hover:bg-gray-500 text-sm mt-6 md:mt-0 m-2"
                  onClick={() => methods.reset()}
                  disabled={ucitavanje}
                >
                  Očisti filtere
                </button>
              </div>
            </div>
          )}
        </form>
      </FormProvider>
      {greska && <div className="text-red-500 mb-4">{greska}</div>}
      <div className="grid-container h-[595px] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projekti.map((projekt) => (
            <Link
              to={`/projekti/${projekt.id}`}
              key={projekt.id}
              className="p-4 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-800 overflow-y-scroll h-80"
            >
              <h2 className="text-xl font-bold mb-2">{projekt.naziv}</h2>
              <p className="text-black dark:text-white mb-2 whitespace-pre-line wrap-break-word">{projekt.opis}</p>
              <p className="text-sm mb-2">
                <span className="font-semibold">Budžet: </span>
                <span>{formatNovac(projekt.budzet)}</span>
              </p>
              <p className="text-sm mb-2">
                <span className="font-semibold">Rok izrade:</span>{' '}
                {new Date(projekt.rokIzrade).toLocaleDateString('hr')}
              </p>
              <div className="mb-3">
                <div className="flex flex-wrap gap-2 mt-1">
                  {projekt.vjestine.map((vjestina) => (
                    <span
                      key={vjestina.id}
                      className="text-black bg-gray-200 dark:text-white dark:bg-gray-800 text-sm md:text-m px-2 py-1"
                    >
                    {vjestina.naziv}
                  </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};