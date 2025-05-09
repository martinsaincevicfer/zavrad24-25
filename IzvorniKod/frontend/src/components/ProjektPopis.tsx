import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Projekt } from '../types/projekt';
import Header from "./Header.tsx";

export const ProjektPopis: React.FC = () => {
    const [projekti, setProjekti] = useState<Projekt[]>([]);
    const [ucitavanje, setUcitavanje] = useState(true);
    const [greska, setGreska] = useState<string | null>(null);

    useEffect(() => {
        const dohvatiProjekte = async () => {
            try {
                const odgovor = await fetch('http://localhost:8080/api/projekti');
                if (!odgovor.ok) {
                    throw new Error('Mrežna pogreška');
                }
                const podaci = await odgovor.json();
                setProjekti(podaci);
            } catch (error) {
                setGreska('Došlo je do pogreške prilikom dohvaćanja projekata.');
            } finally {
                setUcitavanje(false);
            }
        };

        dohvatiProjekte();
    }, []);

    if (ucitavanje) return <div className="text-center p-4">Učitavanje...</div>;
    if (greska) return <div className="text-red-500 p-4">{greska}</div>;

    return (
        <div className="container mx-auto">
            <Header />

            <h1 className="text-2xl font-bold mb-6">Popis projekata</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projekti.map((projekt) => (
                    <div key={projekt.id} className="border rounded-lg p-4 shadow-sm">
                        <h2 className="text-xl font-semibold mb-2">{projekt.naziv}</h2>
                        <p className="text-gray-600 mb-2 line-clamp-2">{projekt.opis}</p>
                        <p className="text-sm mb-2">
                            <span className="font-semibold">Rok:</span>{' '}
                            {new Date(projekt.rok).toLocaleDateString('hr')}
                        </p>
                        <div className="mb-3">
                            <span className="font-semibold">Potrebne vještine:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {projekt.vjestine.map((vjestina) => (
                                    <span
                                        key={vjestina.id}
                                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                                    >
                    {vjestina.naziv}
                  </span>
                                ))}
                            </div>
                        </div>
                        <Link
                            to={`/projekti/${projekt.id}`}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            Više detalja →
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};