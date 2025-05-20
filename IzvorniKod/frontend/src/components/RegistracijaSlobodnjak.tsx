import React, { useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import Header from "./Header.tsx";

const RegistracijaSlobodnjak: React.FC = () => {
    const [kratkiOpis, setKratkiOpis] = useState('');
    const [edukacija, setEdukacija] = useState('');
    const [iskustvo, setIskustvo] = useState('');
    const [vjestine, setVjestine] = useState<number[]>([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const data = {
                kratkiOpis,
                edukacija,
                iskustvo,
                vjestine: vjestine.map((id) => ({ id }))
            };

            await axiosInstance.post('/slobodnjaci/register', data);
            alert('Uspješna registracija kao slobodnjak!');
            navigate('/homepage');
        } catch (err) {
            console.error(err);
            setError('Registracija slobodnjaka nije uspjela.');
        }
    };

    const handleVjestinaToggle = (id: number) => {
        setVjestine((prev) =>
            prev.includes(id) ? prev.filter((vjestinaId) => vjestinaId !== id) : [...prev, id]
        );
    };

    return (
        <div className="min-h-screen min-w-screen">
            <Header />
            <div className="max-w-md w-full mt-5 min-w-screen min-h-full flex flex-col items-center justify-center">
                <h2 className="text-center text-3xl font-extrabold">Registriraj se kao Slobodnjak</h2>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && <div className="text-red-500 text-center">{error}</div>}
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="kratkiOpis" className="block text-sm font-medium">
                                Kratki Opis
                            </label>
                            <textarea
                                id="kratkiOpis"
                                required
                                rows={3}
                                className="appearance-none rounded block w-full px-3 py-2 border focus:outline-none sm:text-sm"
                                value={kratkiOpis}
                                onChange={(e) => setKratkiOpis(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="edukacija" className="block text-sm font-medium">
                                Edukacija
                            </label>
                            <input
                                id="edukacija"
                                type="text"
                                required
                                className="appearance-none rounded block w-full px-3 py-2 border focus:outline-none sm:text-sm"
                                value={edukacija}
                                onChange={(e) => setEdukacija(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="iskustvo" className="block text-sm font-medium">
                                Iskustvo
                            </label>
                            <textarea
                                id="iskustvo"
                                rows={3}
                                required
                                className="appearance-none rounded block w-full px-3 py-2 border focus:outline-none sm:text-sm"
                                value={iskustvo}
                                onChange={(e) => setIskustvo(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="vjestine" className="block text-sm font-medium">
                                Vještine
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {[{ id: 1, naziv: 'JavaScript' }, { id: 3, naziv: 'React' }].map(
                                    (vjestina) => (
                                        <label key={vjestina.id} className="inline-flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={vjestine.includes(vjestina.id)}
                                                onChange={() => handleVjestinaToggle(vjestina.id)}
                                            />
                                            <span className="ml-2">{vjestina.naziv}</span>
                                        </label>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 focus:outline-none"
                    >
                        Registriraj se
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegistracijaSlobodnjak;