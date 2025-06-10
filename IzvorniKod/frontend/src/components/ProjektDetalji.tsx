import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {Projekt} from '../types/Projekt';
import Header from './Header';
import axiosInstance from '../utils/axiosConfig';
import {authService} from '../services/authService';
import {Ponuda} from "../types/Ponuda.ts";
import {Korisnik, Osoba, Tvrtka} from "../types/Korisnik.ts";


const ponudaSchema = z.object({
  iznos: z.number()
    .positive('Iznos mora biti pozitivan broj.')
    .min(1, 'Minimalni iznos je 1€.')
    .max(9999999999.99, 'Budžet prelazi maksimalnu dozvoljenu vrijednost.'),
  poruka: z.string()
    .min(5, 'Poruka mora imati barem 5 znakova.')
    .max(500, 'Poruka ne smije imati više od 500 znakova.'),
});

type PonudaForm = z.infer<typeof ponudaSchema>;

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

  const {
    register,
    handleSubmit,
    reset,
    formState: {errors, isSubmitting},
  } = useForm<PonudaForm>({
    resolver: zodResolver(ponudaSchema),
    mode: 'onSubmit',
  });

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

        if (ulogiraniKorisnik === korisnikResponse.data.email) {
          const ponudeResponse = await axiosInstance.get<Ponuda[]>(`/ponude/projekt/${id}`);
          setPonude(ponudeResponse.data);
        }
      } catch (error) {
        console.error('Greška pri dohvaćanju podataka:', error);
        setGreska('Došlo je do pogreške prilikom dohvaćanja podataka.');
      } finally {
        setUcitavanje(false);
      }
    };

    dohvatiProjekt();
  }, [id, ulogiraniKorisnik]);

  const posaljiPonudu = async (data: PonudaForm) => {
    try {
      await axiosInstance.post('/ponude/stvori', {
        ...data,
        projektId: Number(id),
      });
      alert('Ponuda je uspješno kreirana!');
      reset();
      setPrikaziFormu(false);
    } catch (error) {
      console.error('Greška pri slanju ponude:', error);
      alert('Došlo je do pogreške prilikom kreiranja ponude.');
    }
  };

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
  if (!projekt) return <>
    <Header/>
    <div className="flex justify-center items-center min-h-screen p-4">
      Projekt nije pronađen.
    </div>
  </>;

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

  if (ucitavanje) return <>
    <Header/>
    <div className="container max-w-7xl mx-auto text-center">
      Učitavanje...
    </div>
  </>;
  if (greska) return <>
    <Header/>
    <div className="container max-w-7xl mx-auto text-center text-red-500 p-4">
      {greska}
    </div>
  </>;
  if (!projekt) return <>
    <Header/>
    <div className="container max-w-7xl mx-auto text-center p-4">
      Projekt nije pronađen.
    </div>
  </>;

  return (
    <>
      <Header/>

      <div className="container max-w-7xl mx-auto rounded-lg px-3 sm:px-6 lg:px-9">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{projekt.naziv}</h1>
          <span className="text-gray-500">ID: {projekt.id}</span>
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

        {jePonuditelj && (
          <div className="mt-6">
            <button
              onClick={() => setPrikaziFormu(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Kreiraj novu ponudu
            </button>

            {prikaziFormu && (
              <div className="mt-4 p-4 border rounded-lg">
                <h2 className="text-xl font-bold mb-2">Nova ponuda</h2>

                <form onSubmit={handleSubmit(posaljiPonudu)}>
                  <div className="mb-4">
                    <label htmlFor="iznos" className="block text-sm font-medium">
                      Iznos (€)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('iznos', {valueAsNumber: true})}
                      className={`mt-1 block w-full ${
                        errors.iznos ? 'border-red-500' : 'border-gray-300'
                      } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {errors.iznos && (
                      <p className="text-red-500 text-sm">{errors.iznos.message}</p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label htmlFor="poruka" className="block text-sm font-medium">
                      Poruka
                    </label>
                    <textarea
                      {...register('poruka')}
                      rows={3}
                      className={`mt-1 block w-full ${
                        errors.poruka ? 'border-red-500' : 'border-gray-300'
                      } rounded-md focus:ring-blue-500 focus:border-blue-500`}
                    ></textarea>
                    {errors.poruka && (
                      <p className="text-red-500 text-sm">{errors.poruka.message}</p>
                    )}
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Šaljem...' : 'Pošalji'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrikaziFormu(false)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Zatvori
                    </button>
                  </div>
                </form>
              </div>
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

        {ulogiraniKorisnik === korisnik?.email && ponude && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Ponude za projekt</h2>
            {ponude.length === 0 ? (
              <p>Trenutno nema ponuda za ovaj projekt.</p>
            ) : (
              <ul className="space-y-4">
                {ponude.map((ponuda) => (
                  <li key={ponuda.id} className="border rounded-lg p-4">
                    <p>
                      Ponuditelj:
                      <Link
                        to={`/ponuditelji/${ponuda.ponuditelj.id}`}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        {ponuda.ponuditelj.ime} {ponuda.ponuditelj.prezime} {ponuda.ponuditelj.nazivTvrtke} ({ponuda.ponuditelj.email})
                      </Link>
                    </p>
                    <p>
                      <strong>Iznos:</strong> {ponuda.iznos} €
                    </p>
                    <p>
                      <strong>Poruka:</strong> {ponuda.poruka}
                    </p>
                    <p>
                      <strong>Rok za prihvaćanje ponude:</strong> {formatDatum(ponuda.rokZaPrihvacanje)}
                    </p>
                    <p>
                      <strong>Datum slanja ponude:</strong> {formatDatum(ponuda.datumStvaranja)}
                    </p>

                    {ponuda.status === 'aktivna' && (<button
                      onClick={async () => {
                        try {
                          await axiosInstance.post('/ugovori/korisnik/stvori', {
                            ponudaId: ponuda.id,
                            datumPocetka: new Date().toISOString().split('T')[0],
                            datumZavrsetka: new Date(
                              new Date().setMonth(new Date().getMonth() + 1)
                            ).toISOString().split('T')[0],
                          });
                          alert('Ugovor uspješno kreiran!');
                          location.reload();
                          setPrikaziFormu(false);
                        } catch (error) {
                          console.error('Greška pri prihvaćanju ponude:', error);
                          alert('Dogodila se pogreška prilikom prihvaćanja ponude.');
                        }
                      }}
                      className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Prihvati ponudu
                    </button>)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

      </div>
    </>
  );
};