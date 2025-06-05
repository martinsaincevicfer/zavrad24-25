import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {Projekt} from '../types/Projekt';
import {KorisnikDTO, OsobaDTO, TvrtkaDTO} from '../types/Korisnik';
import Header from './Header';
import axiosInstance from '../utils/axiosConfig';
import {authService} from '../services/authService';
import {PrijavaDTO} from "../types/PrijavaDTO.ts";


const prijavaSchema = z.object({
  iznos: z.number().positive('Iznos mora biti pozitivan broj.').min(1, 'Minimalni iznos je 1€.'),
  poruka: z.string().min(5, 'Poruka mora imati barem 5 znakova.').max(500, 'Poruka ne smije imati više od 500 znakova.'),
});

type PrijavaForm = z.infer<typeof prijavaSchema>;

export const DetaljiProjekta: React.FC = () => {
  const {id} = useParams<{ id: string }>();
  const [projekt, setProjekt] = useState<Projekt | null>(null);
  const [korisnik, setKorisnik] = useState<KorisnikDTO | null>(null);
  const [ucitavanje, setUcitavanje] = useState(true);
  const [greska, setGreska] = useState<string | null>(null);
  const [prikaziFormu, setPrikaziFormu] = useState(false);
  const jeHonorarac = authService.isUserInRole('honorarac');
  const [prijave, setPrijave] = useState<PrijavaDTO[] | null>(null);

  const ulogiraniKorisnik = authService.getCurrentUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: {errors, isSubmitting},
  } = useForm<PrijavaForm>({
    resolver: zodResolver(prijavaSchema),
    mode: 'onSubmit',
  });

  useEffect(() => {
    const dohvatiProjekt = async () => {
      try {
        if (!id) throw new Error('ID projekta nije definiran');
        const response = await axiosInstance.get<Projekt>(`/projekti/${id}`);
        setProjekt(response.data);

        const korisnikResponse = await axiosInstance.get<KorisnikDTO>(`/korisnici/${response.data.korisnikId}`);
        setKorisnik(korisnikResponse.data);

        if (ulogiraniKorisnik === korisnikResponse.data.email) {
          const prijaveResponse = await axiosInstance.get<PrijavaDTO[]>(`/prijave/projekt/${id}`);
          setPrijave(prijaveResponse.data);
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

  const podnesiPrijavu = async (data: PrijavaForm) => {
    try {
      await axiosInstance.post('/prijave/stvori', {
        ...data,
        projektId: Number(id),
      });
      alert('Prijava je uspješno kreirana!');
      reset();
      setPrikaziFormu(false);
    } catch (error) {
      console.error('Greška pri slanju prijave:', error);
      alert('Došlo je do pogreške prilikom kreiranja prijave.');
    }
  };

  if (ucitavanje) return <div className="text-center p-4">Učitavanje...</div>;
  if (greska) return <div className="text-red-500 p-4">{greska}</div>;
  if (!projekt) return <div className="text-center p-4">Projekt nije pronađen.</div>;

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

  const formatKorisnikPodaci = (korisnik: KorisnikDTO) => {
    if (korisnik.tip === 'OSOBA') {
      const osoba = korisnik as OsobaDTO;
      return `${osoba.ime} ${osoba.prezime}`;
    } else if (korisnik.tip === 'TVRTKA') {
      const tvrtka = korisnik as TvrtkaDTO;
      return tvrtka.nazivTvrtke || 'Nepoznati korisnik';
    }
    return 'Nepoznati korisnik';
  };

  if (ucitavanje) return <div className="text-center p-4">Učitavanje...</div>;
  if (greska) return <div className="text-red-500 p-4">{greska}</div>;
  if (!projekt) return <div className="text-center p-4">Projekt nije pronađen.</div>;

  return (
    <>
      <Header/>

      <div className="container max-w-7xl mx-auto rounded-lg shadow-lg px-3 sm:px-6 lg:px-9">
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
                <span className="font-semibold">Rok:</span>
                <span>{formatDatum(projekt.rok).split(',')[0]}</span>
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
        </div>

        {jeHonorarac && (
          <div className="mt-6">
            <button
              onClick={() => setPrikaziFormu(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Kreiraj novu prijavu
            </button>

            {prikaziFormu && (
              <div className="mt-4 p-4 border rounded-lg shadow">
                <h2 className="text-xl font-bold mb-2">Nova Prijava</h2>

                <form onSubmit={handleSubmit(podnesiPrijavu)}>
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
                      } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
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
                      } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
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

        {ulogiraniKorisnik === korisnik?.email && prijave && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Prijave za projekt</h2>
            {prijave.length === 0 ? (
              <p>Trenutno nema prijava za ovaj projekt.</p>
            ) : (
              <ul className="space-y-4">
                {prijave.map((prijava) => (
                  <li key={prijava.id} className="border rounded-lg p-4 shadow-md">
                    <p>
                      <strong>Honorarac:</strong>
                      {prijava.honorarac.ime} {prijava.honorarac.prezime} {prijava.honorarac.tvrtka} ({prijava.honorarac.email})
                    </p>
                    <p>
                      <strong>Iznos:</strong> {prijava.iznos} €
                    </p>
                    <p>
                      <strong>Poruka:</strong> {prijava.poruka}
                    </p>
                    <p>
                      <strong>Datum prijave:</strong> {formatDatum(prijava.datumStvaranja)}
                    </p>

                    {prijava.status === 'aktivna' && (<button
                      onClick={async () => {
                        try {
                          await axiosInstance.post('/ugovori/korisnik/stvori', {
                            prijavaId: prijava.id,
                            datumPocetka: new Date().toISOString().split('T')[0],
                            datumZavrsetka: new Date(
                              new Date().setMonth(new Date().getMonth() + 1)
                            ).toISOString().split('T')[0],
                          });
                          alert('Ugovor uspješno kreiran!');
                          location.reload();
                          setPrikaziFormu(false);
                        } catch (error) {
                          console.error('Greška pri prihvaćanju prijave:', error);
                          alert('Dogodila se pogreška prilikom prihvaćanja prijave.');
                        }
                      }}
                      className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Prihvati prijavu
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