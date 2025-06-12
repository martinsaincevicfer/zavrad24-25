import React, {useEffect, useMemo, useState} from 'react';
import {Controller, useFormContext} from 'react-hook-form';
import debounce from 'lodash/debounce';
import axiosInstance from '../utils/axiosConfig';
import {Vjestina} from '../types/Vjestina';
import {Check} from "lucide-react";

type Props = {
  name: string;
};

const VjestinaAutocomplete: React.FC<Props> = ({name}) => {
  const {control, watch} = useFormContext();
  const [options, setOptions] = useState<Vjestina[]>([]);
  const [selected, setSelected] = useState<Vjestina[]>([]);
  const [input, setInput] = useState('');

  const fieldValue = watch(name);

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

  useEffect(() => {
    const updateSelected = async () => {
      const ids: number[] = fieldValue;
      if (ids && ids.length) {
        const res = await axiosInstance.get<Vjestina[]>('/vjestine', {params: {ids: ids.join(',')}});
        setSelected(res.data);
      } else {
        setSelected([]);
      }
    };
    updateSelected();
  }, [fieldValue]);

  return (
    <Controller
      name={name}
      control={control}
      render={({field}) => {
        return (
          <div>
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Pretraži vještine..."
              onFocus={handleInputChange}
              onBlur={() => setOptions([])}
            />
            <div className="bg-white dark:bg-gray-700 border absolute z-10 max-h-1/5 overflow-y-scroll">
              {options.map((v) => {
                const isSelected = field.value.includes(v.id);
                return (
                  <div
                    key={v.id}
                    onMouseDown={() => {
                      if (isSelected) {
                        field.onChange(field.value.filter((vid: number) => vid !== v.id));
                        setSelected(selected.filter((s) => s.id !== v.id));
                      } else {
                        field.onChange([...field.value, v.id]);
                        setSelected([...selected, v]);
                      }
                      setInput('');
                      setOptions([]);
                    }}
                    className="text-black dark:text-white cursor-pointer p-2 flex items-center"
                  >
                    {isSelected && <span className="mr-2"><Check/></span>}
                    {v.naziv}
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap mt-2 gap-1">
              {field.value.map((id: number) => {
                const v = selected.find((o) => o.id === id);
                return (
                  <span key={id} className="bg-gray-700 rounded-lg px-2">
                    {(v && v.naziv) ? v.naziv : 'Učitavam...'}
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
        );
      }}
    />
  );
};

export default VjestinaAutocomplete;