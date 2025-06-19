import React, {useEffect, useMemo, useState} from 'react';
import {Controller, useFormContext} from 'react-hook-form';
import debounce from 'lodash/debounce';
import axiosInstance from '../utils/axiosConfig';
import {Vjestina} from '../types/Vjestina';
import {Check, X} from "lucide-react";

type Props = {
  name: string;
};

const VjestinaAutocomplete: React.FC<Props> = ({name}) => {
  const {control, watch} = useFormContext();
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

  useEffect(() => {
    const ids: number[] = watch(name) ?? [];
    const updateSelected = async () => {
      if (ids.length) {
        const res = await axiosInstance.get<Vjestina[]>('/vjestine', {params: {ids: ids.join(',')}});
        setSelected(res.data);
      } else {
        setSelected([]);
      }
    };
    updateSelected();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch(name), name]);

  return (
    <Controller
      name={name}
      control={control}
      render={({field}) => {
        const value = field.value ?? [];
        return (
          <div>
            <input
              type="text"
              value={input}
              onChange={e => {
                handleInputChange(e);
                field.onChange(value);
              }}
              className="w-full p-2 border rounded"
              placeholder="Pretraži vještine..."
              onFocus={e => {
                handleInputChange(e);
                field.onChange(value);
              }}
              onBlur={() => setOptions([])}
            />
            {options.length > 0 && (
              <div className="bg-white dark:bg-gray-700 border absolute z-10 max-h-1/5 overflow-y-scroll">
                {options.map((v) => {
                  const isSelected = value.includes(v.id);
                  return (
                    <div
                      key={v.id}
                      onMouseDown={() => {
                        if (isSelected) {
                          field.onChange(value.filter((vid: number) => vid !== v.id));
                        } else {
                          field.onChange([...value, v.id]);
                        }
                        setInput('');
                        setOptions([]);
                      }}
                      className="text-black dark:text-white cursor-pointer p-2 flex items-center"
                    >
                      {isSelected && <span className="mr-2"><Check/></span>}
                      {v.naziv} <span className="ml-2 text-xs text-gray-500">({v.kategorija})</span>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="flex flex-wrap mt-2 gap-1">
              {(value ?? []).map((id: number) => {
                const v = selected.find((o) => o.id === id);
                return (
                  <span key={id} className="flex flex-row items-center p-3 bg-gray-700 rounded">
                    <span className="">
                      {(v && v.naziv) ? v.naziv : 'Učitavanje...'}
                    </span>
                    <button
                      type="button"
                      onClick={() => field.onChange(value.filter((vid: number) => vid !== id))}
                      className="!p-0 !m-0 text-red-500 hover:text-red-600"
                    >
                      <X/>
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