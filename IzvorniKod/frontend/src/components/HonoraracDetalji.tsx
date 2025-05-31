import React from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {HonoraracDTO} from '../types/Honorarac';
import Header from './Header';
import axiosInstance from '../utils/axiosConfig';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import AxiosXHR = Axios.AxiosXHR;

const PonudaSchema = z.object({
  naziv: z.string().min(1, 'Naziv je obavezan'),
  opis: z.string().min(1, 'Opis je obavezan'),
  budzet: z.number().positive('Budžet mora biti pozitivan broj').min(1, 'Minimalan iznos je 1'),
  rok: z.string().nonempty('Rok je obavezan'),
});

type PonudaForm = z.infer<typeof PonudaSchema>;

const HonoraracDetalji: React.FC = () => {
  const {id} = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [honorarac, setHonorarac] = React.useState<HonoraracDTO | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<PonudaForm>({
    resolver: zodResolver(PonudaSchema),
  });

  const submitPonuda = async (data: PonudaForm) => {
    try {
      const payload = {
        ...data,
        honoraracId: Number.parseInt(id || '0', 10),
      };

      await axiosInstance.post('/ponude/stvori', payload);
      alert('Ponuda je uspješno stvorena!');
      setIsFormOpen(false);
    } catch (err) {
      console.error('Greška prilikom stvaranja ponude:', err);
      alert('Došlo je do pogreške prilikom stvaranja ponude.');
    }
  };

  React.useEffect(() => {
    const fetchHonorarac = async () => {
      try {
        if (!id) throw new Error('ID honorarca nije definiran');
        const response: AxiosXHR<HonoraracDTO> = await axiosInstance.get(`/honorarci/${id}`);
        setHonorarac(response.data);
        setError(null);
      } catch (error) {
        console.error('Greška pri dohvaćanju profila:', error);
        setError('Došlo je do pogreške prilikom dohvaćanja podataka.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHonorarac();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Učitavanje...</div>
      </div>
    );
  }

  if (error || !honorarac) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Honorarac nije pronađen.'}</p>
          <button
            onClick={() => navigate('/honorarci')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Povratak na popis
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header/>
      <div className="container max-w-7xl mx-auto mt-8 px-3 sm:px-6 lg:px-9">
        <h1 className="text-3xl font-bold mb-6">
          {honorarac.tip === 'TVRTKA' ? honorarac.nazivTvrtke : `${honorarac.ime} ${honorarac.prezime}`}
        </h1>

        <div className="rounded-lg shadow-md p-8 space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              {honorarac.tip === 'TVRTKA' ? 'Podaci o tvrtki' : 'Osobni podaci'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {honorarac.tip === 'TVRTKA' ? (
                <>
                  <div>
                    <p className="font-medium">Naziv tvrtke:</p>
                    <p>{honorarac.nazivTvrtke}</p>
                  </div>
                  <div>
                    <p className="font-medium">OIB:</p>
                    <p>{honorarac.oib}</p>
                  </div>
                  <div>
                    <p className="font-medium">Adresa tvrtke:</p>
                    <p>{honorarac.adresaTvrtke}</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="font-medium">Ime:</p>
                    <p>{honorarac.ime}</p>
                  </div>
                  <div>
                    <p className="font-medium">Prezime:</p>
                    <p>{honorarac.prezime}</p>
                  </div>
                  <div>
                    <p className="font-medium">Adresa:</p>
                    <p>{honorarac.adresa}</p>
                  </div>
                </>
              )}
              <div>
                <p className="font-medium">Email:</p>
                <p>{honorarac.email}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Profesionalni profil</h2>
            <div className="space-y-6">
              <div>
                <p className="font-medium mb-2">Opis:</p>
                <p>{honorarac.kratkiOpis}</p>
              </div>
              <div>
                <p className="font-medium mb-2">Edukacija:</p>
                <p>{honorarac.edukacija}</p>
              </div>
              <div>
                <p className="font-medium mb-2">Iskustvo:</p>
                <p>{honorarac.iskustvo}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Vještine</h2>
            <div className="flex flex-wrap gap-2">
              {honorarac.vjestine.map((vjestina) => (
                <span
                  key={vjestina.id}
                  className="bg-blue-300 text-blue-800 px-3 py-1 rounded-full"
                >
                  {vjestina.naziv}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="font-medium">Član od:</p>
            <p>{new Date(honorarac.datumStvaranja).toLocaleDateString('hr-HR')}</p>
          </div>

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => setIsFormOpen(true)}
          >
            Stvori ponudu
          </button>
        </div>

        {isFormOpen && (
          <form onSubmit={handleSubmit(submitPonuda)} className="mt-8 space-y-4 border rounded p-8">
            <div>
              <label className="block font-medium">Naziv ponude</label>
              <input
                {...register('naziv')}
                className="w-full border rounded px-3 py-2"
                placeholder="Unesite naziv ponude"
              />
              {errors.naziv && <p className="text-red-500">{errors.naziv.message}</p>}
            </div>

            <div>
              <label className="block font-medium">Opis ponude</label>
              <textarea
                {...register('opis')}
                className="w-full border rounded px-3 py-2"
                placeholder="Unesite opis ponude"
              />
              {errors.opis && <p className="text-red-500">{errors.opis.message}</p>}
            </div>

            <div>
              <label className="block font-medium">Budžet</label>
              <input
                type="number"
                {...register('budzet', {valueAsNumber: true})}
                className="w-full border rounded px-3 py-2"
                placeholder="Unesite budžet"
              />
              {errors.budzet && <p className="text-red-500">{errors.budzet.message}</p>}
            </div>

            <div>
              <label className="block font-medium">Rok</label>
              <input
                type="date"
                {...register('rok')}
                className="w-full border rounded px-3 py-2"
              />
              {errors.rok && <p className="text-red-500">{errors.rok.message}</p>}
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Odustani
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Pošalji ponudu
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default HonoraracDetalji;