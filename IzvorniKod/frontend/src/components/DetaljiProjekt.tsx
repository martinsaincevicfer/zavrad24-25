import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Projekt } from '../types/projekt';

export const DetaljiProjekta: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [projekt, setProjekt] = useState<Projekt | null>(null);
    const [ucitavanje, setUcitavanje] = useState(true);
    const [greska, setGreska] = useState<string | null>(null);

    useEffect(() => {
        const dohvatiProjekt = async () => {
            try {
                if (!id) throw new Error('ID projekta nije definiran');
                const odgovor = await fetch(`http://localhost:8080/api/projekti/${id}`);
                if (!odgovor.ok) {
                    throw new Error('Mrežna pogreška');
                }
                const podaci = await odgovor.json();
                setProjekt(podaci);
            } catch (error) {
                setGreska('Došlo je do pogreške prilikom dohvaćanja projekta.');
            } finally {
                setUcitavanje(false);
            }
        };

        dohvatiProjekt();
    }, [id]);

    if (ucitavanje) return <div className="text-center p-4">Učitavanje...</div>;
    if (greska) return <div className="text-red-500 p-4">{greska}</div>;
    if (!projekt) return <div className="text-center p-4">Projekt nije pronađen.</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-3xl font-bold mb-4">{projekt.naziv}</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Opis projekta</h2>
                        <p className="text-gray-700 mb-4">{projekt.opis}</p>

                        <h2 className="text-xl font-semibold mb-2">Potrebne vještine</h2>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {projekt.vjestine.map((vjestina) => (
                                <span
                                    key={vjestina.id}
                                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                                >
                  {vjestina.naziv}
                </span>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h2 className="text-xl font-semibold mb-2">Detalji projekta</h2>
                            <div className="space-y-2">
                                <p>
                                    <span className="font-semibold">Rok:</span>{' '}
                                    {new Date(projekt.rok).toLocaleDateString('hr')}
                                </p>
                                <p>
                                    <span className="font-semibold">Budžet:</span>{' '}
                                    {projekt.budzet.toLocaleString('hr')} HRK
                                </p>
                                <p>
                                    <span className="font-semibold">Datum stvaranja:</span>{' '}
                                    {new Date(projekt.datumStvaranja).toLocaleDateString('hr')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};