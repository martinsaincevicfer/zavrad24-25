import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';

const registracijaTvrtkaSchema = z.object({
  email: z.string().email('Unesite valjan email.'),
  lozinka: z.string().min(6, 'Lozinka mora sadržavati najmanje 6 znakova.'),
  ponovljenaLozinka: z.string().min(6, 'Morate unijeti istu lozinku.'),
  nazivTvrtke: z.string().min(2, 'Naziv tvrtke mora sadržavati najmanje 2 znaka.'),
  oib: z.string().length(11, 'OIB mora sadržavati točno 11 znakova.'),
  adresa: z.string().min(5, 'Adresa mora sadržavati najmanje 5 znakova.')
}).refine(
  (data) => data.lozinka === data.ponovljenaLozinka,
  {
    message: 'Lozinke se ne podudaraju.',
    path: ['lozinka', 'ponovljenaLozinka']
  }
);

type RegistracijaTvrtkaForm = z.infer<typeof registracijaTvrtkaSchema>;

const RegistracijaTvrtka = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegistracijaTvrtkaForm>({
    resolver: zodResolver(registracijaTvrtkaSchema),
    mode: 'all'
  });

  const onSubmit = async (data: RegistracijaTvrtkaForm) => {
    try {
      await axios.post('/api/auth/register/tvrtka', data);
      alert('Registracija tvrtke uspješna!');
      navigate('/login');
    } catch (error: unknown) {
      console.error('Greška prilikom registracije:', error);
      alert('Došlo je do greške. Pokušajte ponovno.');
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto shadow-md rounded">
        <h1 className="text-xl font-bold mb-6 text-center">Registracija Tvrtke</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 px-3 sm:px-6 lg:px-9 max-w-1/2 mx-auto">
          <div className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Email"
              {...register('email')}
              className={`p-2 border rounded ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <input
              type="password"
              placeholder="Lozinka"
              {...register('lozinka')}
              className={`p-2 border rounded ${errors.lozinka ? 'border-red-500' : ''}`}
            />
            {errors.lozinka && <p className="text-red-500 text-sm">{errors.lozinka.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <input
              type="password"
              placeholder="Ponovite lozinku"
              {...register('ponovljenaLozinka')}
              className={`p-2 border rounded ${errors.ponovljenaLozinka ? 'border-red-500' : ''}`}
            />
            {errors.ponovljenaLozinka && (
              <p className="text-red-500 text-sm">{errors.ponovljenaLozinka.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Naziv tvrtke"
              {...register('nazivTvrtke')}
              className={`p-2 border rounded ${errors.nazivTvrtke ? 'border-red-500' : ''}`}
            />
            {errors.nazivTvrtke && <p className="text-red-500 text-sm">{errors.nazivTvrtke.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="OIB"
              {...register('oib')}
              className={`p-2 border rounded ${errors.oib ? 'border-red-500' : ''}`}
            />
            {errors.oib && <p className="text-red-500 text-sm">{errors.oib.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Adresa"
              {...register('adresa')}
              className={`p-2 border rounded ${errors.adresa ? 'border-red-500' : ''}`}
            />
            {errors.adresa && <p className="text-red-500 text-sm">{errors.adresa.message}</p>}
          </div>

          <button
            type="submit"
            className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Registriraj se
          </button>
        </form>
      </div>
    </>
  );
};

export default RegistracijaTvrtka;