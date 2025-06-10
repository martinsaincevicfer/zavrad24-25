import React, {useMemo, useState} from 'react';
import {Controller, useFormContext} from 'react-hook-form';
import debounce from 'lodash/debounce';
import axiosInstance from '../utils/axiosConfig';
import {Vjestina} from '../types/Vjestina';

type Props = {
  name: string;
};

const VjestinaAutocomplete: React.FC<Props> = ({name}) => {
  const {control} = useFormContext();
  const [options, setOptions] = useState<Vjestina[]>([]);
  const [selected, setSelected] = useState<Vjestina[]>([]);
  const [input, setInput] = useState('');

  const fetchOptions = useMemo(
    () =>
      debounce(async (query: string) => {
        const res = await axiosInstance.get<Vjestina[]>('/vjestine', {params: {naziv: query}});
        setOptions(res.data);
      }, 300),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    fetchOptions(e.target.value);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({field}) => (
        <div>
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Pretraži vještine..."
          />
          <div className="bg-white dark:bg-gray-700 border absolute z-10 max-h-1/5 overflow-y-scroll">
            {options.map((v) => (
              <div
                key={v.id}
                onClick={() => {
                  if (!field.value.includes(v.id)) {
                    field.onChange([...field.value, v.id]);
                    setSelected([...selected, v]);
                  }
                  setInput('');
                  setOptions([]);
                }}
                className="text-black dark:text-white cursor-pointer p-2"
              >
                {v.naziv}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap mt-2 gap-1">
            {field.value.map((id: number) => {
              const v = selected.find((o) => o.id === id);
              return (
                <span key={id} className="bg-gray-700 rounded-lg px-2">
                  {v?.naziv || id}
                  <button
                    type="button"
                    onClick={() => field.onChange(field.value.filter((vid: number) => vid !== id))}
                    className="ml-1 text-red-500"
                  >
                    &times;
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    />
  );
};

export default VjestinaAutocomplete;