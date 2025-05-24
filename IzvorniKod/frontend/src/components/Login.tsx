import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import Header from './Header';

const loginSchema = z.object({
  email: z.string().email('Unesite valjan email.'),
  lozinka: z.string().min(6, 'Lozinka mora imati najmanje 6 znakova.')
});

type LoginForm = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: 'all'
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await authService.login(data);
      navigate('/homepage');
    } catch (error: unknown) {
      console.error('Greška prilikom prijave: ' ,error)
      alert('Neuspješna prijava. Provjerite email i lozinku.');
    }
  };

  return (
    <>
      <Header />
      <div className="container max-w-7xl mx-auto flex flex-col items-center">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold">
            Prijava
          </h2>
        </div>
        <form className="mt-8 space-y-6 min-w-1/3" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm flex flex-col gap-4">
            <div>
              <input
                type="email"
                placeholder="Email adresa"
                {...register('email')}
                className={`appearance-none rounded relative block w-full px-3 py-2 border rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${
                  errors.email ? 'border-red-500' : ''
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
            <div>
              <input
                type="password"
                placeholder="Lozinka"
                {...register('lozinka')}
                className={`appearance-none rounded relative block w-full px-3 py-2 border rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${
                  errors.lozinka ? 'border-red-500' : ''
                }`}
              />
              {errors.lozinka && <p className="text-red-500 text-sm">{errors.lozinka.message}</p>}
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Prijavi se
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;