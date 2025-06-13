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
  const [, setPonudaZaUredi] = useState<Ponuda | null>(null);

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
      alert('Ponuda je uspješno kreirana!');
      setPrikaziFormu(false);
      location.reload();
    } catch (error) {
      console.error('Greška pri slanju ponude:', error);
      alert('Došlo je do pogreške prilikom kreiranja ponude.');
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
      alert('Ugovor uspješno kreiran!');
      setPrikaziFormu(false);

      const ponudeResponse = await axiosInstance.get<Ponuda[]>(`/ponude/projekt/${id}`);
      setPonude(ponudeResponse.data);
    } catch (error) {
      console.error('Greška pri prihvaćanju ponude:', error);
      alert('Dogodila se pogreška prilikom prihvaćanja ponude.');
    }
  }


  const onEditPonuda = (ponuda: Ponuda) => {
    setPonudaZaUredi(ponuda);
    setPrikaziFormu(true);
  };

  const onDeletePonuda = async (ponudaId: number) => {
    if (!window.confirm('Jeste li sigurni da želite obrisati ovu ponudu?')) return;
    try {
      await axiosInstance.delete(`/ponude/${ponudaId}`);
      const ponudeResponse = await axiosInstance.get<Ponuda[]>(`/ponude/projekt/${id}`);
      setPonude(ponudeResponse.data);
    } catch (error) {
      console.error(error);
      alert('Greška prilikom brisanja ponude.');
    }
  };

  const obrisiProjekt = async () => {
    if (!window.confirm('Jeste li sigurni da želite obrisati ovaj projekt?')) return;
    try {
      await axiosInstance.delete(`/projekti/${id}`);
      alert('Projekt je obrisan.');
      window.location.href = '/korisnik/projekti';
    } catch (error) {
      console.error(error);
      alert('Greška prilikom brisanja projekta.');
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
    <>
      <div className="container max-w-8xl mx-auto rounded-lg px-3 sm:px-6 lg:px-9">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{projekt.naziv}</h1>
          {ulogiraniKorisnik === korisnik?.email && !projektImaUgovor && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={urediProjekt}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Uredi projekt
              </button>
              <button
                onClick={obrisiProjekt}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Obriši projekt
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Opis projekta</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 truncate">{projekt.opis}</p>

            <h2 className="text-xl font-semibold mb-2">Potrebne vještine</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {projekt.vjestine.map((vjestina) => (
                <div
                  key={vjestina.id}
                  className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                >
                  <span>{vjestina.naziv}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Detalji projekta</h2>
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Budžet:</span>
                <span>{formatNovac(projekt.budzet)}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Rok izrade:</span>
                <span>{formatDatum(projekt.rokIzrade).split(',')[0]}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Datum stvaranja:</span>
                <span>{formatDatum(projekt.datumStvaranja)}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Korisnik:</span>
                <span>{korisnik ? formatKorisnikPodaci(korisnik) : 'Učitavanje...'}</span>
              </div>
            </div>
          </div>


          {!ulogiraniKorisnik && (
            <Link
              to={"/login"}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 w-1/3"
            >
              Kreiraj novu ponudu
            </Link>
          )}
        </div>

        {ulogiraniKorisnik === korisnik?.email && projekt.status !== 'zatvoren' && (
          <ZatvoriProjektGumb projektId={projekt.id}/>
        )}

        {jePonuditelj && !ponuditeljVecPoslaoPonudu && !(ulogiraniKorisnik === korisnik?.email) && (
          <div className="mt-6">
            <button
              onClick={() => setPrikaziFormu(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Kreiraj novu ponudu
            </button>

            {prikaziFormu && (
              <PonudaForm onSubmit={posaljiPonudu} onCancel={() => setPrikaziFormu(false)}/>
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
          <PonudaPopis ponude={ponude} formatDatum={formatDatum} onPrihvatiPonudu={stvoriUgovor} korisnik={korisnik}
                       onEditPonuda={onEditPonuda} onDeletePonuda={onDeletePonuda}/>
        )}
      </div>
    </>
  );
};