import React from "react";
import {useForm} from "react-hook-form";
import axiosInstance from "../utils/axiosConfig";

type RezultatForm = {
  naziv: string;
  file: FileList;
};

const RezultatUploadForm: React.FC<{ ugovorId: number }> = ({ugovorId}) => {
  const {register, handleSubmit, formState: {errors, isSubmitting}, reset} = useForm<RezultatForm>();

  const onSubmit = async (data: RezultatForm) => {
    const formData = new FormData();
    formData.append("ugovorId", ugovorId.toString());
    formData.append("naziv", data.naziv);
    formData.append("file", data.file[0]);

    try {
      await axiosInstance.post("/rezultati/upload", formData, {
        headers: {"Content-Type": "multipart/form-data"}
      });
      alert("Rezultat uspješno uploadan!");
      reset();
    } catch (err) {
      console.error(err);
      alert("Greška pri uploadu rezultata.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mt-6">
      <div>
        <label className="block font-semibold">Naziv rezultata:</label>
        <input
          type="text"
          {...register("naziv", {required: "Naziv je obavezan"})}
          className="border rounded px-2 py-1 w-full"
        />
        {errors.naziv && <span className="text-red-500">{errors.naziv.message}</span>}
      </div>
      <div>
        <label className="block font-semibold">Datoteka:</label>
        <input
          type="file"
          {...register("file", {required: "Datoteka je obavezna"})}
          className="border rounded px-2 py-1 w-full"
        />
        {errors.file && <span className="text-red-500">{errors.file.message}</span>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {isSubmitting ? "Slanje..." : "Uploadaj rezultat"}
      </button>
    </form>
  );
};

export default RezultatUploadForm;