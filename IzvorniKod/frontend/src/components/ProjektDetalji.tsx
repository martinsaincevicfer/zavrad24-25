import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {Projekt} from '../types/Projekt';
import axiosInstance from '../utils/axiosConfig';
import {authService} from '../services/authService';
import {Ponuda} from "../types/Ponuda.ts";
import {Korisnik, Osoba, Tvrtka} from "../types/Korisnik.ts";
import ZatvoriProjektGumb from "./ZatvoriProjektGumb.tsx";
import PonudaForm, {PonudaFormType} from './PonudaForm';
import PonudaPopis from "./PonudaPopis.tsx";
import {toast, ToastContainer} from "react-toastify";
import {useConfirm} from "./ConfirmContext.tsx";


export const ProjektDetalji: React.FC = () => {
  const {id} = useParams<{ id: string }>();
  const [projekt, setProjekt] = useState<Projekt | null>(null);
  const [korisnik, setKorisnik] = useState<Korisnik | null>(null);
  const [ucitavanje, setUcitavanje] = useState(true);
  const [greska, setGreska] = useState<string | null>(null);
  const [prikaziFormu, setPrikaziFormu] = useState(false);
  const jePonuditelj = authService.isUserInRole('ponuditelj');
  const [ponude, setPonude] = useState<Ponuda[] | null>(null);
  const ulogiraniKorisnik = authService.getCurrentUser();
  const confirm = useConfirm();

  useEffect(() => {
    const dohvatiProjekt = async () => {
      try {
        if (!id) {
          console.error("Projekt ID nije definiran.")
        }
        const response = await axiosInstance.get<Projekt>(`/projekti/${id}`);
        setProjekt(response.data);

        const korisnikResponse = await axiosInstance.get<Korisnik>(`/korisnici/${response.data.narucitelj.id}`);
        setKorisnik(korisnikResponse.data);

        const ponudeResponse = await axiosInstance.get<Ponuda[]>(`/ponude/projekt/${id}`);
        setPonude(ponudeResponse.data);
      } catch (error) {
        console.error('Greška pri dohvaćanju podataka:', error);
        setGreska('Došlo je do pogreške prilikom dohvaćanja podataka.');
      } finally {
        setUcitavanje(false);
      }
    };

    dohvatiProjekt();
  }, [id, ulogiraniKorisnik]);

  const posaljiPonudu = async (data: PonudaFormType) => {
    try {
      await axiosInstance.post('/ponude/stvori', {
        ...data,
        projektId: Number(id),
      });
      toast.success('Ponuda je uspješno kreirana!');
      setPrikaziFormu(false);
      const ponudeResponse = await axiosInstance.get<Ponuda[]>(`/ponude/projekt/${id}`);
      setPonude(ponudeResponse.data);
    } catch (error) {
      console.error('Greška pri slanju ponude:', error);
      toast.error('Došlo je do pogreške prilikom kreiranja ponude.');
    }
  };

  const onSaveEditPonuda = async (ponudaId: number, data: { iznos: number; poruka: string }) => {
    try {
      await axiosInstance.put(`/ponude/${ponudaId}`, {
        iznos: data.iznos,
        poruka: data.poruka,
      });
      toast.success('Ponuda uspješno uređena.');

      const ponudeResponse = await axiosInstance.get<Ponuda[]>(`/ponude/projekt/${id}`);
      setPonude(ponudeResponse.data);
    } catch (error) {
      console.error(error);
      toast.error('Greška prilikom uređivanja ponude.');
    }
  };

  const stvoriUgovor = async (ponudaId: number) => {
    try {
      await axiosInstance.post('/ugovori/korisnik/stvori', {
        ponudaId: ponudaId,
        datumPocetka: new Date().toISOString().split('T')[0],
        datumZavrsetka: new Date(
          new Date().setMonth(new Date().getMonth() + 1)
        ).toISOString().split('T')[0],
      });
      toast.success('Ugovor uspješno kreiran!');
      setPrikaziFormu(false);

      const ponudeResponse = await axiosInstance.get<Ponuda[]>(`/ponude/projekt/${id}`);
      setPonude(ponudeResponse.data);
    } catch (error) {
      console.error('Greška pri prihvaćanju ponude:', error);
      toast.error('Dogodila se pogreška prilikom prihvaćanja ponude.');
    }
  }

  const onDeletePonuda = async (ponudaId: number) => {
    if (!(await confirm({message: 'Jeste li sigurni da želite obrisati ovu ponudu?'}))) return;
    try {
      await axiosInstance.delete(`/ponude/${ponudaId}`);
      const ponudeResponse = await axiosInstance.get<Ponuda[]>(`/ponude/projekt/${id}`);
      setPonude(ponudeResponse.data);
    } catch (error) {
      console.error(error);
      toast.error('Greška prilikom brisanja ponude.');
    }
  };

  const obrisiProjekt = async () => {
    if (!(await confirm({message: 'Jeste li sigurni da želite obrisati ovaj projekt?'}))) return;
    try {
      await axiosInstance.delete(`/projekti/${id}`);
      toast.success('Projekt je obrisan.');
      window.location.href = '/korisnik/projekti';
    } catch (error) {
      console.error(error);
      toast.error('Greška prilikom brisanja projekta.');
    }
  };

  const urediProjekt = () => {
    window.location.href = `/projekti/${id}/uredi`;
  };

  const formatDatum = (datum: string) =>
    new Date(datum).toLocaleDateString('hr-HR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const formatNovac = (iznos: number) =>
    new Intl.NumberFormat('hr-HR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(iznos);

  const formatKorisnikPodaci = (korisnik: Korisnik) => {
    if (korisnik.tip === 'osoba') {
      const osoba = korisnik as Osoba;
      return `${osoba.ime} ${osoba.prezime}`;
    } else if (korisnik.tip === 'tvrtka') {
      const tvrtka = korisnik as Tvrtka;
      return tvrtka.nazivTvrtke || 'Nepoznati korisnik';
    }
    return 'Nepoznati korisnik';
  };

  const ponuditeljVecPoslaoPonudu = ponude?.some(
    (ponuda) => ponuda.ponuditelj.email === ulogiraniKorisnik
  );

  const projektImaUgovor = ponude?.some(ponuda => ponuda.status === 'prihvacena');

  if (ucitavanje) return <>
    <div className="container max-w-8xl mx-auto text-center">
      Učitavanje...
    </div>
  </>;
  if (greska) return <>
    <div className="container max-w-8xl mx-auto text-center text-red-500 p-4">
      {greska}
    </div>
  </>;
  if (!projekt) return <>
    <div className="container max-w-8xl mx-auto text-center p-4">
      Projekt nije pronađen.
    </div>
  </>;

  return (
    <div className="container max-w-7xl mx-auto mt-5 px-3 sm:px-6 lg:px-9">
      <ToastContainer theme="auto" position="top-center"
                      toastClassName={"text-black bg-gray-100 dark:text-white dark:bg-gray-900"}
                      limit={1}
      />
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold">{projekt.naziv}</h1>
        {ulogiraniKorisnik === korisnik?.email && !projektImaUgovor && (
          <div className="hidden md:flex gap-2 mt-4 items-center justify-center">
            {ulogiraniKorisnik === korisnik?.email && projekt.status !== 'zatvoren' && (
              <ZatvoriProjektGumb projektId={projekt.id}/>
            )}
            <button
              onClick={urediProjekt}
              className="bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Uredi projekt
            </button>
            <button
              onClick={obrisiProjekt}
              className="bg-red-500 text-white rounded hover:bg-red-600"
            >
              Obriši projekt
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="mb-4">
          <div className="flex justify-between pb-2">
            <span className="font-semibold text-l md:text-xl">Naručitelj:</span>
            <span
              className="text-l md:text-xl">{projekt.narucitelj ? formatKorisnikPodaci(projekt.narucitelj) : 'Učitavanje...'}
            </span>
          </div>
          <div className="flex justify-between pb-2">
            <span className="font-semibold text-l md:text-xl">Budžet:</span>
            <span className="text-l md:text-xl">{formatNovac(projekt.budzet)}</span>
          </div>
          <div className="flex justify-between pb-2">
            <span className="font-semibold text-l md:text-xl">Datum stvaranja:</span>
            <span className="text-l md:text-xl">{formatDatum(projekt.datumStvaranja)}</span>
          </div>
          <div className="flex justify-between pb-2">
            <span className="font-semibold text-l md:text-xl">Rok izrade:</span>
            <span className="text-l md:text-xl">{formatDatum(projekt.rokIzrade).split(',')[0]}</span>
          </div>
          <div className="flex flex-col justify-start gap-2">
            <h2 className="text-l md:text-xl font-semibold mb-2">Opis projekta:</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 truncate text-l md:text-xl">{projekt.opis}</p>
          </div>
          <h2 className="text-l md:text-xl font-semibold mb-2">Preporučene vještine:</h2>
          <div className="flex flex-wrap gap-2">
            {projekt.vjestine.map((vjestina) => (
              <div
                key={vjestina.id}
                className="flex items-center text-black bg-gray-200 dark:text-white dark:bg-gray-800 text-l md:text-xl px-3 py-1"
              >
                <span>{vjestina.naziv}</span>
              </div>
            ))}
          </div>
        </div>

        {ulogiraniKorisnik === korisnik?.email && !projektImaUgovor && (
          <div className="flex flex-col md:hidden gap-2 items-start justify-center mb-4">
            {ulogiraniKorisnik === korisnik?.email && projekt.status !== 'zatvoren' && (
              <ZatvoriProjektGumb projektId={projekt.id}/>
            )}
            <button
              onClick={urediProjekt}
              className="bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Uredi projekt
            </button>
            <button
              onClick={obrisiProjekt}
              className="bg-red-500 text-white rounded hover:bg-red-600"
            >
              Obriši projekt
            </button>
          </div>
        )}

        {!ulogiraniKorisnik && (
          <Link
            to={"/login"}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 w-1/3"
          >
            Kreiraj novu ponudu
          </Link>
        )}
      </div>

      {jePonuditelj && !ponuditeljVecPoslaoPonudu && !(ulogiraniKorisnik === korisnik?.email) && (
        <div className="my-6">
          <button
            onClick={() => setPrikaziFormu((prev) => !prev)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {prikaziFormu ? 'Zatvori' : 'Kreiraj novu ponudu'}
          </button>

          {prikaziFormu && (
            <PonudaForm onSubmit={posaljiPonudu}/>
          )}
        </div>
      )}

      {ulogiraniKorisnik && !jePonuditelj && !(ulogiraniKorisnik === korisnik?.email) && (
        <Link
          to={'/registracija/ponuditelj'}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Registriraj se kao ponuditelj
        </Link>
      )}

      {ponude && (
        <PonudaPopis ponude={ponude}
                     formatDatum={formatDatum}
                     onPrihvatiPonudu={stvoriUgovor}
                     korisnik={korisnik}
                     onDeletePonuda={onDeletePonuda}
                     onSaveEditPonuda={onSaveEditPonuda}/>
      )}
    </div>
  );
};