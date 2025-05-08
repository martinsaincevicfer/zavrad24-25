import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Projekt } from '../types/projekt';
import Header from "./Header.tsx";

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

    const formatDatum = (datum: string) => {
        return new Date(datum).toLocaleDateString('hr-HR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatNovac = (iznos: number) => {
        return new Intl.NumberFormat('hr-HR', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2
        }).format(iznos);
    };

    return (
    <div className="container mx-auto min-h-screen">
        <Header />

        <div className="rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">{projekt.naziv}</h1>
                    <span className="text-gray-500">ID: {projekt.id}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Opis projekta</h2>
                        <p className="text-gray-700 mb-6">{projekt.opis}</p>

                        <h2 className="text-xl font-semibold mb-2">Potrebne vještine</h2>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {projekt.vjestine.map((vjestina) => (
                                <div 
                                    key={vjestina.id} 
                                    className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                                >
                                    <span>{vjestina.naziv}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Detalji projekta</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between border-b pb-2">
                                <span className="font-semibold">Budžet:</span>
                                <span>{formatNovac(projekt.budzet)}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="font-semibold">Rok:</span>
                                <span>{formatDatum(projekt.rok).split(',')[0]}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="font-semibold">Datum stvaranja:</span>
                                <span>{formatDatum(projekt.datumStvaranja)}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span className="font-semibold">Korisnik ID:</span>
                                <span>{projekt.korisnikId}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};