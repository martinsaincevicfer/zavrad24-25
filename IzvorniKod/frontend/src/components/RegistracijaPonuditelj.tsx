import React from 'react';
import {z} from 'zod';
import {FormProvider, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useNavigate} from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import {LoginResponse} from "../types/Auth.ts";
import VjestinaAutocomplete from "./VjestinaAutocomplete.tsx";
import {toast, ToastContainer} from "react-toastify";

const ponuditeljSchema = z.object({
  kratkiOpis: z.string()
    .min(10, 'Kratki opis mora imati najmanje 10 znakova.')
    .max(500, 'Kratki opis može imati najviše 500 znakova.'),
  edukacija: z.string()
    .min(2, 'Edukacija mora imati najmanje 2 znaka.'),
  iskustvo: z.string()
    .min(10, 'Iskustvo mora imati najmanje 10 znakova.'),
  vjestine: z.array(z.number())
    .nonempty('Morate odabrati barem jednu vještinu.')
});

type PonuditeljForm = z.infer<typeof ponuditeljSchema>;

const RegistracijaPonuditelj: React.FC = () => {
  const navigate = useNavigate();

  const methods = useForm<PonuditeljForm>({
    resolver: zodResolver(ponuditeljSchema),
    mode: 'all',
    defaultValues: {
      vjestine: []
    }
  });

  const {register, formState: {errors}} = methods;

  const onSubmit = async (data: PonuditeljForm) => {
    try {
      const response = await axiosInstance.post<LoginResponse>('/ponuditelji/register', data);
      if (response.data.token && response.data.email) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', response.data.email);
      }
      toast.success('Uspješna registracija kao ponuditelj!');
      navigate('/profil');
      window.location.reload();
    } catch (err) {
      console.error('Greška prilikom registracije:', err);
      toast.error('Registracija ponuditelja nije uspjela.');
    }
  };

  return (
    <div className="max-w-8xl mx-auto flex flex-col items-center justify-center">
      <ToastContainer theme="auto" position="top-center"
                      toastClassName={"text-black bg-gray-100 dark:text-white dark:bg-gray-900"}
                      limit={1}
      />
      <h2 className="text-center text-3xl font-extrabold">Registriraj se kao ponuditelj</h2>
      <FormProvider {...methods}>
        <form className="mt-8 space-y-6 w-2/3 md:w-xl" onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="rounded-md space-y-4">
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
              <VjestinaAutocomplete name={"vjestine"}/>
              {errors.vjestine && <p className="text-red-500 text-sm">{errors.vjestine.message}</p>}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none"
          >
            Registriraj se
          </button>
        </form>
      </FormProvider>
    </div>
  );
};

export default RegistracijaPonuditelj;