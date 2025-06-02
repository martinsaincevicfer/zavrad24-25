import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import axiosInstance from '../utils/axiosConfig';
import Header from './Header';
import {useNavigate} from 'react-router-dom';
import {Vjestina} from '../types/Projekt';


const projektSchema = z.object({
  naziv: z.string().min(2, 'Naziv projekta mora sadržavati najmanje 2 znaka.'),
  opis: z.string().min(10, 'Opis projekta mora sadržavati najmanje 10 znakova.'),
  budzet: z
    .number({invalid_type_error: 'Budžet mora biti broj.'})
    .min(1, 'Budžet mora biti veći od 0.'),
  rok: z.string().refine(
    (value) => !isNaN(Date.parse(value)),
    {message: 'Datum roka mora biti ispravan.'}
  ),
  vjestine: z.array(z.number()).nonempty('Morate odabrati barem jednu vještinu.')
});

type ProjektForm = z.infer<typeof projektSchema>;

const KreiranjeProjekta: React.FC = () => {
  const navigate = useNavigate();
  const [vjestine, setVjestine] = useState<Vjestina[]>([]);
  const [ucitavanje, setUcitavanje] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    formState: {errors}
  } = useForm<ProjektForm>({
    resolver: zodResolver(projektSchema),
    mode: 'all',
    defaultValues: {
      vjestine: []
    }
  });

  useEffect(() => {
    const dohvatiVjestine = async () => {
      try {
        const response = await axiosInstance.get<Vjestina[]>('/vjestine');
        setVjestine(response.data);
      } catch (error) {
        console.error('Greška prilikom dohvaćanja vještina:', error);
      } finally {
        setUcitavanje(false);
      }
    };

    dohvatiVjestine();
  }, []);

  const onSubmit = async (data: ProjektForm) => {
    try {
      console.log('Podaci za slanje:', data);

      await axiosInstance.post('/projekti/stvori', data);
      alert('Projekt uspješno kreiran!');
      navigate('/korisnik/projekti');
    } catch (error) {
      console.error('Greška prilikom kreiranja projekta:', error);
      alert('Došlo je do greške. Pokušajte ponovno.');
    }
  };

  if (ucitavanje) {
    return <div>Učitavanje podataka...</div>;
  }

  return (
    <>
      <Header/>
      <div className="max-w-4xl mx-auto p-6 shadow-md rounded">
        <h1 className="text-2xl font-bold mb-6 text-center">Kreiraj Novi Projekt</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <label className="block text-sm font-medium mb-1" htmlFor="rok">
              Rok projekta
            </label>
            <input
              type="date"
              id="rok"
              className={`w-full p-2 border rounded ${errors.rok ? 'border-red-500' : ''}`}
              {...register('rok')}
            />
            {errors.rok && <p className="text-red-500 text-sm">{errors.rok.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="vjestine">
              Potrebne vještine
            </label>
            <Controller
              name="vjestine"
              control={control}
              defaultValue={[]}
              render={({field}) => (
                <div className="grid grid-cols-2 gap-2">
                  {vjestine.map((vjestina) => (
                    <label key={vjestina.id} className="inline-flex items-center">
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
                  ))}
                </div>
              )}
            />
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
      </div>
    </>
  );
};

export default KreiranjeProjekta;