import {useEffect, useState} from 'react';
import axiosInstance from '../utils/axiosConfig';
import {authService} from '../services/authService';
import {Link} from 'react-router-dom';
import {Korisnik, Osoba, Tvrtka} from "../types/Korisnik.ts";
import {Ponuditelj} from "../types/Ponuditelj.ts";
import {FormProvider, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import VjestinaAutocomplete from "./VjestinaAutocomplete.tsx";

const osobaSchema = z.object({
  ime: z.string().min(2, "Ime je obavezno"),
  prezime: z.string().min(2, "Prezime je obavezno"),
  adresa: z.string().min(2, "Adresa je obavezna"),
});
const tvrtkaSchema = z.object({
  nazivTvrtke: z.string().min(2, "Naziv tvrtke je obavezan"),
  oib: z.string().min(2, "OIB je obavezan"),
  adresa: z.string().min(2, "Adresa je obavezna"),
});
const ponuditeljSchema = z.object({
  kratkiOpis: z.string().min(2, "Opis je obavezan"),
  edukacija: z.string().min(2, "Edukacija je obavezna"),
  iskustvo: z.string().min(2, "Iskustvo je obavezno"),
  vjestine: z.array(z.number()).min(1, "Odaberite barem jednu vještinu"),
});

type OsobaForm = z.infer<typeof osobaSchema>;
type TvrtkaForm = z.infer<typeof tvrtkaSchema>;
type PonuditeljForm = z.infer<typeof ponuditeljSchema>;

const Profil = () => {
  const [userProfile, setUserProfile] = useState<Korisnik | null>(null);
  const [freelancerProfile, setFreelancerProfile] = useState<Ponuditelj | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userError, setUserError] = useState<string>('');
  const [freelancerError, setFreelancerError] = useState<string>('');
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isEditingFreelancer, setIsEditingFreelancer] = useState(false);

  const jePonuditelj = authService.isUserInRole('ponuditelj');
  const jeAdministrator = authService.isUserInRole('administrator');

  const osobaForm = useForm<OsobaForm>({
    resolver: zodResolver(osobaSchema),
    defaultValues: {ime: '', prezime: '', adresa: ''}
  });

  const tvrtkaForm = useForm<TvrtkaForm>({
    resolver: zodResolver(tvrtkaSchema),
    defaultValues: {nazivTvrtke: '', oib: '', adresa: ''}
  });

  const freelancerForm = useForm<PonuditeljForm>({
    resolver: zodResolver(ponuditeljSchema),
    defaultValues: {
      kratkiOpis: '',
      edukacija: '',
      iskustvo: '',
      vjestine: [],
    }
  });
  const {
    register: freelancerRegister,
    handleSubmit: handleFreelancerSubmit,
    reset: resetFreelancerForm,
    formState: {errors: freelancerErrors, isSubmitting: isFreelancerSubmitting}
  } = freelancerForm;

  useEffect(() => {
    const loadProfiles = async () => {
      setLoading(true);
      try {
        const userRes = await axiosInstance.get<Korisnik>('/korisnici/profil');
        setUserProfile(userRes.data);

        if (jePonuditelj) {
          const freelancerRes = await axiosInstance.get<Ponuditelj>('/ponuditelji/current');
          setFreelancerProfile(freelancerRes.data);
        }
      } catch {
        setUserError('Došlo je do pogreške pri dohvaćanju podataka korisničkog profila.');
      } finally {
        setLoading(false);
      }
    };
    loadProfiles();
  }, [jePonuditelj]);

  useEffect(() => {
    if (userProfile) {
      if (userProfile.tip === 'tvrtka') {
        const tvrtka = userProfile as Tvrtka;
        tvrtkaForm.reset({
          nazivTvrtke: tvrtka.nazivTvrtke || '',
          oib: tvrtka.oib || '',
          adresa: tvrtka.adresa || ''
        });
      } else {
        const osoba = userProfile as Osoba;
        osobaForm.reset({
          ime: osoba.ime || '',
          prezime: osoba.prezime || '',
          adresa: osoba.adresa || ''
        });
      }
    }
    // eslint-disable-next-line
  }, [userProfile]);

  useEffect(() => {
    if (freelancerProfile) {
      resetFreelancerForm({
        kratkiOpis: freelancerProfile.kratkiOpis || '',
        edukacija: freelancerProfile.edukacija || '',
        iskustvo: freelancerProfile.iskustvo || '',
        vjestine: freelancerProfile.vjestine?.map(v => v.id) || [],
      });
    }
  }, [freelancerProfile, resetFreelancerForm]);

  const onOsobaSubmit = async (data: OsobaForm) => {
    try {
      await axiosInstance.put('/auth/update/osoba', data);
      setIsEditingUser(false);
      const userRes = await axiosInstance.get<Korisnik>('/korisnici/profil');
      setUserProfile(userRes.data);
    } catch {
      setUserError('Greška pri spremanju podataka.');
    }
  };

  const onTvrtkaSubmit = async (data: TvrtkaForm) => {
    try {
      await axiosInstance.put('/auth/update/tvrtka', data);
      setIsEditingUser(false);
      const userRes = await axiosInstance.get<Korisnik>('/korisnici/profil');
      setUserProfile(userRes.data);
    } catch {
      setUserError('Greška pri spremanju podataka.');
    }
  };

  const onFreelancerSubmit = async (data: PonuditeljForm) => {
    try {
      await axiosInstance.put('/ponuditelji/current', {
        ...freelancerProfile,
        ...data,
        vjestine: data.vjestine.map(id => ({id})),
      });
      setIsEditingFreelancer(false);
      const freelancerRes = await axiosInstance.get<Ponuditelj>('/ponuditelji/current');
      setFreelancerProfile(freelancerRes.data);
    } catch {
      setFreelancerError('Greška pri spremanju podataka.');
    }
  };

  const formatDatum = (datum: string) =>
    new Date(datum).toLocaleDateString('hr-HR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="text-xl">Učitavanje...</div>
    </div>;
  }
  if (userError) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="text-red-500">{userError}</div>
    </div>;
  }

  return (
    <div className="mt-8 px-3 sm:px-6 lg:px-9 flex justify-around">
      <div className="flex flex-col items-start justify-between gap-6 w-full md:w-1/2 border rounded-lg p-6">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-4xl p-4 font-bold">Profil</h1>
          {!isEditingUser && (
            <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    onClick={() => setIsEditingUser(true)}>
              Uredi
            </button>
          )}
        </div>
        {userProfile && (
          isEditingUser ? (
            userProfile.tip === 'tvrtka' ? (
              <form onSubmit={tvrtkaForm.handleSubmit(onTvrtkaSubmit)} className="flex flex-col gap-4 w-4/5">
                <div>
                  <label>Naziv tvrtke</label>
                  <input {...tvrtkaForm.register('nazivTvrtke')} className="border p-2 rounded w-full"/>
                  {tvrtkaForm.formState.errors.nazivTvrtke &&
                    <p className="text-red-500">{tvrtkaForm.formState.errors.nazivTvrtke.message}</p>}
                </div>
                <div>
                  <label>OIB</label>
                  <input {...tvrtkaForm.register('oib')} className="border p-2 rounded w-full"/>
                  {tvrtkaForm.formState.errors.oib &&
                    <p className="text-red-500">{tvrtkaForm.formState.errors.oib.message}</p>}
                </div>
                <div>
                  <label>Adresa</label>
                  <input {...tvrtkaForm.register('adresa')} className="border p-2 rounded w-full"/>
                  {tvrtkaForm.formState.errors.adresa &&
                    <p className="text-red-500">{tvrtkaForm.formState.errors.adresa.message}</p>}
                </div>
                <div className="flex gap-2">
                  <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                          onClick={() => {
                            setIsEditingUser(false);
                            tvrtkaForm.reset();
                          }}>Odustani
                  </button>
                  <button type="submit" disabled={tvrtkaForm.formState.isSubmitting}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Spremi
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={osobaForm.handleSubmit(onOsobaSubmit)} className="flex flex-col gap-4 w-4/5">
                <div>
                  <label>Ime</label>
                  <input {...osobaForm.register('ime')} className="border p-2 rounded w-full"/>
                  {osobaForm.formState.errors.ime &&
                    <p className="text-red-500">{osobaForm.formState.errors.ime.message}</p>}
                </div>
                <div>
                  <label>Prezime</label>
                  <input {...osobaForm.register('prezime')} className="border p-2 rounded w-full"/>
                  {osobaForm.formState.errors.prezime &&
                    <p className="text-red-500">{osobaForm.formState.errors.prezime.message}</p>}
                </div>
                <div>
                  <label>Adresa</label>
                  <input {...osobaForm.register('adresa')} className="border p-2 rounded w-full"/>
                  {osobaForm.formState.errors.adresa &&
                    <p className="text-red-500">{osobaForm.formState.errors.adresa.message}</p>}
                </div>
                <div className="flex gap-2">
                  <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                          onClick={() => {
                            setIsEditingUser(false);
                            osobaForm.reset();
                          }}>Odustani
                  </button>
                  <button type="submit" disabled={osobaForm.formState.isSubmitting}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Spremi
                  </button>
                </div>
              </form>
            )
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-3/4">
              {userProfile.tip === 'tvrtka' ? (
                <>
                  <div className="p-4 rounded-lg">
                    <p className="text-gray-600">Naziv tvrtke</p>
                    <p className="font-semibold">{(userProfile as Tvrtka).nazivTvrtke}</p>
                  </div>
                  <div className="p-4 rounded-lg">
                    <p className="text-gray-600">OIB</p>
                    <p className="font-semibold">{(userProfile as Tvrtka).oib}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 rounded-lg">
                    <p className="text-gray-600">Ime</p>
                    <p className="font-semibold">{(userProfile as Osoba).ime}</p>
                  </div>
                  <div className="p-4 rounded-lg">
                    <p className="text-gray-600">Prezime</p>
                    <p className="font-semibold">{(userProfile as Osoba).prezime}</p>
                  </div>
                </>
              )}
              <>
                <div className="p-4 rounded-lg">
                  <p className="text-gray-600">Email</p>
                  <p className="font-semibold">{userProfile.email}</p>
                </div>
                <div className="p-4 rounded-lg">
                  <p className="text-gray-600">Adresa</p>
                  <p className="font-semibold">{userProfile.tip === 'tvrtka'
                    ? (userProfile as Tvrtka).adresa
                    : (userProfile as Osoba).adresa}</p>
                </div>
              </>
            </div>
          )
        )}

        {jePonuditelj && (
          <div className="w-full t border-t-1 pt-6">
            <div className="flex items-center justify-between w-full">
              <h2 className="text-2xl font-bold">Podaci o ponuditelju</h2>
              {!isEditingFreelancer && (
                <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                        onClick={() => setIsEditingFreelancer(true)}>
                  Uredi
                </button>
              )}
            </div>
            {isEditingFreelancer && freelancerProfile ? (
              <FormProvider {...freelancerForm}>
                <form onSubmit={handleFreelancerSubmit(onFreelancerSubmit)} className="flex flex-col gap-4 w-full mt-2">
                  <div>
                    <label>Kratki opis</label>
                    <input {...freelancerRegister('kratkiOpis')} className="border p-2 rounded w-full"/>
                    {freelancerErrors.kratkiOpis &&
                      <p className="text-red-500">{freelancerErrors.kratkiOpis.message}</p>}
                  </div>
                  <div>
                    <label>Edukacija</label>
                    <input {...freelancerRegister('edukacija')} className="border p-2 rounded w-full"/>
                    {freelancerErrors.edukacija && <p className="text-red-500">{freelancerErrors.edukacija.message}</p>}
                  </div>
                  <div>
                    <label>Iskustvo</label>
                    <input {...freelancerRegister('iskustvo')} className="border p-2 rounded w-full"/>
                    {freelancerErrors.iskustvo && <p className="text-red-500">{freelancerErrors.iskustvo.message}</p>}
                  </div>
                  <div>
                    <label>Vještine</label>
                    <VjestinaAutocomplete name="vjestine"/>
                    {freelancerErrors.vjestine &&
                      <p className="text-red-500">{freelancerErrors.vjestine.message as string}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            onClick={() => {
                              setIsEditingFreelancer(false);
                              resetFreelancerForm();
                            }}>
                      Odustani
                    </button>
                    <button type="submit" disabled={isFreelancerSubmitting}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                      Spremi
                    </button>
                  </div>
                </form>
              </FormProvider>
            ) : (
              freelancerProfile && (
                <div className="space-y-4 mt-2">
                  <div className="p-4 rounded-lg">
                    <p className="text-gray-600">Kratki Opis</p>
                    <p className="font-semibold">{freelancerProfile.kratkiOpis}</p>
                  </div>
                  <div className="p-4 rounded-lg">
                    <p className="text-gray-600">Edukacija</p>
                    <p className="font-semibold">{freelancerProfile.edukacija}</p>
                  </div>
                  <div className="p-4 rounded-lg">
                    <p className="text-gray-600">Iskustvo</p>
                    <p className="font-semibold">{freelancerProfile.iskustvo}</p>
                  </div>
                  <div className="p-4 rounded-lg">
                    <p className="text-gray-600">Datum Stvaranja</p>
                    <p className="font-semibold">{formatDatum(freelancerProfile.datumStvaranja)}</p>
                  </div>
                  <div className="p-4 rounded-lg">
                    <p className="text-gray-600">Vještine</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {freelancerProfile.vjestine.map((vjestina) => (
                        <span key={vjestina.id}
                              className="text-black bg-gray-100 dark:text-white dark:bg-gray-900 text-l md:text-xl px-2 py-1">
                          {vjestina.naziv}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            )}
            {freelancerError && <div className="text-red-500">{freelancerError}</div>}
          </div>
        )}

        {!jePonuditelj && !jeAdministrator && (
          <div className="flex items-center justify-center w-full t border-t-1 pt-6">
            <div className="flex flex-col items-center">
              <p className="text-lg font-medium mb-4">Trenutno niste registrirani kao ponuditelj.</p>
              <Link to={'/registracija/ponuditelj'}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Registriraj se kao ponuditelj
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profil;