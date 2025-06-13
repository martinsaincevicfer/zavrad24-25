import React, {useCallback, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {Projekt} from '../types/Projekt.ts';
import Header from "./Header.tsx";
import axiosInstance from "../utils/axiosConfig.ts";
import {FormProvider, useForm} from "react-hook-form";
import VjestinaAutocomplete from "./VjestinaAutocomplete.tsx";
import debounce from "lodash/debounce";

type SearchForm = {
  naziv: string;
  budzet: number | '';
  rokIzrade: string;
  vjestine: number[];
};

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
    defaultValues: {
      naziv: '',
      budzet: '',
      rokIzrade: '',
      vjestine: [],
    },
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
    <Header/>
    <div className="flex justify-center items-center min-h-screen">
      Učitavanje...
    </div>
  </>;
  if (greska) return <>
    <Header/>
    <div className="flex justify-center items-center min-h-screen text-red-500 p-4">
      {greska}
    </div>
  </>;

  return (
    <>
      <Header/>
      <div className="container max-w-8xl mx-auto mt-8 px-3 sm:px-6 lg:px-9">
        <h1 className="text-2xl font-bold mb-6">Popis projekata</h1>
        <FormProvider {...methods}>
          <form
            onSubmit={e => e.preventDefault()}
            className="space-y-4 mb-8">
            <div className="flex gap-2 items-center">
              <input
                {...methods.register('naziv')}
                type="text"
                placeholder="Naziv projekta"
                className="w-9/10 p-2 border rounded"
              />
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => setShowFilters(f => !f)}
              >
                {showFilters ? 'Sakrij filtere' : 'Prikaži filtere'}
              </button>
            </div>
            {showFilters && (
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  {...methods.register('budzet')}
                  type="number"
                  placeholder="Minimalni budžet"
                  className="w-1/2 md:w-1/4 p-2 border rounded"
                  min={0}
                />
                <input
                  {...methods.register('rokIzrade')}
                  type="date"
                  className="w-1/2 md:w-1/4 p-2 border rounded"
                />
                <VjestinaAutocomplete name="vjestine"/>
                <button
                  type="button"
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                  onClick={() => methods.reset()}
                  disabled={ucitavanje}
                >
                  Očisti filtere
                </button>
              </div>
            )}
          </form>
        </FormProvider>
        {greska && <div className="text-red-500 mb-4">{greska}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projekti.map((projekt) => (
            <Link
              to={`/projekti/${projekt.id}`}
              key={projekt.id}
              className="p-4 bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-800"
            >
              <h2 className="text-xl font-bold mb-2">{projekt.naziv}</h2>
              <p className="text-black dark:text-white mb-2">{projekt.opis}</p>
              <p className="">
                <span className="font-semibold">Budžet:</span>
                <span>{formatNovac(projekt.budzet)}</span>
              </p>
              <p className="text-sm mb-2">
                <span className="font-semibold">Rok izrade:</span>{' '}
                {new Date(projekt.rokIzrade).toLocaleDateString('hr')}
              </p>
              <div className="mb-3">
                <span className="font-semibold">Potrebne vještine:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {projekt.vjestine.map((vjestina) => (
                    <span
                      key={vjestina.id}
                      className="text-black bg-blue-300 text-xs px-2 py-1 roundedbg-blue-300 rounded-full"
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
    </>
  );
};