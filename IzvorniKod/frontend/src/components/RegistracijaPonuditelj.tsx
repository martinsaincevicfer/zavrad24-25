import React, {useEffect, useState} from 'react';
import {z} from 'zod';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useNavigate} from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import Header from './Header';
import {Vjestina} from "../types/Vjestina.ts";


const ponuditeljSchema = z.object({
  kratkiOpis: z.string().min(10, 'Kratki opis mora imati najmanje 10 znakova.'),
  edukacija: z.string().min(2, 'Edukacija mora imati najmanje 2 znaka.'),
  iskustvo: z.string().min(10, 'Iskustvo mora imati najmanje 10 znakova.'),
  vjestine: z.array(z.number()).nonempty('Morate odabrati barem jednu vještinu.')
});

type PonuditeljForm = z.infer<typeof ponuditeljSchema>;

const RegistracijaPonuditelj: React.FC = () => {
  const [vjestine, setVjestine] = useState<{ id: number; naziv: string; kategorija: string }[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVjestine = async () => {
      try {
        const response = await axiosInstance.get<Vjestina[]>('/vjestine');
        setVjestine(response.data);
      } catch (error) {
        console.error('Greška prilikom dohvaćanja vještina:', error);
      }
    };

    fetchVjestine();
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: {errors}
  } = useForm<PonuditeljForm>({
    resolver: zodResolver(ponuditeljSchema),
    mode: 'all',
    defaultValues: {
      vjestine: []
    }
  });

  const onSubmit = async (data: PonuditeljForm) => {
    try {
      await axiosInstance.post('/ponuditelji/register', data);
      alert('Uspješna registracija kao ponuditelj!');
      navigate('/homepage');
    } catch (err) {
      console.error('Greška prilikom registracije:', err);
      alert('Registracija ponuditelja nije uspjela.');
    }
  };

  return (
    <>
      <Header/>
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center">
        <h2 className="text-center text-3xl font-extrabold">Registriraj se kao ponuditelj</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="kratkiOpis" className="block text-sm font-medium">
                Kratki Opis
              </label>
              <textarea
                id="kratkiOpis"
                rows={3}
                className={`appearance-none rounded block w-full px-3 py-2 border focus:outline-none sm:text-sm ${
                  errors.kratkiOpis ? 'border-red-500' : ''
                }`}
                {...register('kratkiOpis')}
              />
              {errors.kratkiOpis && <p className="text-red-500 text-sm">{errors.kratkiOpis.message}</p>}
            </div>
            <div>
              <label htmlFor="edukacija" className="block text-sm font-medium">
                Edukacija
              </label>
              <input
                id="edukacija"
                type="text"
                className={`appearance-none rounded block w-full px-3 py-2 border focus:outline-none sm:text-sm ${
                  errors.edukacija ? 'border-red-500' : ''
                }`}
                {...register('edukacija')}
              />
              {errors.edukacija && <p className="text-red-500 text-sm">{errors.edukacija.message}</p>}
            </div>
            <div>
              <label htmlFor="iskustvo" className="block text-sm font-medium">
                Iskustvo
              </label>
              <textarea
                id="iskustvo"
                rows={3}
                className={`appearance-none rounded block w-full px-3 py-2 border focus:outline-none sm:text-sm ${
                  errors.iskustvo ? 'border-red-500' : ''
                }`}
                {...register('iskustvo')}
              />
              {errors.iskustvo && <p className="text-red-500 text-sm">{errors.iskustvo.message}</p>}
            </div>
            <div>
              <label htmlFor="vjestine" className="block text-sm font-medium">
                Vještine
              </label>
              <Controller
                name="vjestine"
                control={control}
                defaultValue={vjestine.length > 0 ? [vjestine[0].id] : [1]}
                render={({field}) => (
                  <div className="grid grid-cols-3">
                    {vjestine.length > 0 ? (
                      vjestine.map((vjestina) => (
                        <label
                          key={vjestina.id}
                          className="inline-flex items-center"
                        >
                          <input
                            type="checkbox"
                            value={vjestina.id}
                            checked={field.value.includes(vjestina.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                field.onChange([...field.value, vjestina.id]);
                              } else {
                                field.onChange(
                                  field.value.filter((id: number) => id !== vjestina.id)
                                );
                              }
                            }}
                          />
                          <span className="ml-2">{vjestina.naziv}</span>
                        </label>
                      ))
                    ) : (
                      <p>Učitavanje vještina...</p>
                    )}
                  </div>
                )}
              />
              {errors.vjestine && <p className="text-red-500 text-sm">{errors.vjestine.message}</p>}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 focus:outline-none"
          >
            Registriraj se
          </button>
        </form>
      </div>
    </>
  );
};

export default RegistracijaPonuditelj;