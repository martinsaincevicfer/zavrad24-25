import React from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';

const ponudaSchema = z.object({
  iznos: z.number()
    .positive('Iznos mora biti pozitivan broj.')
    .min(1, 'Minimalni iznos je 1€.')
    .max(9999999999.99, 'Budžet prelazi maksimalnu dozvoljenu vrijednost.'),
  poruka: z.string()
    .min(5, 'Poruka mora imati barem 5 znakova.')
    .max(500, 'Poruka ne smije imati više od 500 znakova.'),
});

export type PonudaFormType = z.infer<typeof ponudaSchema>;

interface PonudaFormProps {
  onSubmit: (data: PonudaFormType) => Promise<void>;
  isSubmitting?: boolean;
}

const PonudaForm: React.FC<PonudaFormProps> = ({onSubmit, isSubmitting}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: {errors, isSubmitting: formSubmitting},
  } = useForm<PonudaFormType>({
    resolver: zodResolver(ponudaSchema),
    mode: 'onSubmit',
  });


  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        await onSubmit(data);
        reset();
      })}
      className="mt-4 border p-4 rounded-lg">
      <div className="mb-4">
        <label htmlFor="iznos" className="block text-sm font-medium">
          Iznos (€)
        </label>
        <input
          type="number"
          step="0.01"
          {...register('iznos', {valueAsNumber: true})}
          className={`bg-gray-100 dark:bg-gray-800 mt-1 border block w-full ${errors.iznos ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
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
          className={`bg-gray-100 dark:bg-gray-800 mt-1 border  block w-full ${errors.poruka ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
        ></textarea>
        {errors.poruka && (
          <p className="text-red-500 text-sm">{errors.poruka.message}</p>
        )}
      </div>
      <div className="flex space-x-4">
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          disabled={isSubmitting || formSubmitting}
        >
          {isSubmitting || formSubmitting ? 'Šaljem...' : 'Pošalji'}
        </button>
      </div>
    </form>
  );
};

export default PonudaForm;