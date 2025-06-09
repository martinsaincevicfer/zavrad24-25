import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import {authService} from "../services/authService.ts";

const registracijaSchema = z.object({
  email: z.string().email('Email nije ispravan.'),
  lozinka: z.string().min(6, 'Lozinka mora sadržavati najmanje 6 znakova.'),
  ponovljenaLozinka: z.string().min(6, 'Morate unijeti istu lozinku.'),
  ime: z.string().min(2, 'Ime mora sadržavati najmanje 2 znaka.'),
  prezime: z.string().min(2, 'Prezime mora sadržavati najmanje 2 znaka.'),
  adresa: z.string().min(5, 'Adresa mora sadržavati najmanje 5 znakova.')
})
  .refine(
    (data) => data.lozinka === data.ponovljenaLozinka,
    {
      message: 'Lozinke se ne podudaraju.',
      path: ['lozinka', 'ponovljenaLozinka']
    }
  );

type RegistracijaForm = z.infer<typeof registracijaSchema>;

const RegistracijaOsoba = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm<RegistracijaForm>({
    resolver: zodResolver(registracijaSchema),
    mode: 'all'
  });

  const onSubmit = async (data: RegistracijaForm) => {
    try {
      await axios.post('/api/auth/register/osoba', data);
      await authService.login({email: data.email, lozinka: data.lozinka});
      alert('Registracija uspješna!');
      navigate('/homepage');
    } catch (error: unknown) {
      console.error('Greška prilikom registracije:', error);
      alert('Došlo je do greške. Pokušajte ponovno.');
    }
  };

  return (
    <>
      <Header/>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-9">
        <h1 className="text-2xl font-bold mb-6 text-center">Registracija</h1>
        <form onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col px-3 sm:px-6 lg:px-9 md:max-w-1/3 gap-4 mx-auto">
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
              placeholder="Ime"
              {...register('ime')}
              className={`p-2 border rounded ${errors.ime ? 'border-red-500' : ''}`}
            />
            {errors.ime && <p className="text-red-500 text-sm">{errors.ime.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Prezime"
              {...register('prezime')}
              className={`p-2 border rounded ${errors.prezime ? 'border-red-500' : ''}`}
            />
            {errors.prezime && <p className="text-red-500 text-sm">{errors.prezime.message}</p>}
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

          <div className="text-center">
            <span className="mr-1">
              Želim se registrirati kao
            </span>
            <Link
              to="/registracija/tvrtka"
              className="text-blue-500 hover:text-blue-600 hover:underline"
            >
              tvrtka.
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default RegistracijaOsoba;