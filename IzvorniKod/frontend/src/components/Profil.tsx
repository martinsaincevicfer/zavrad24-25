import { useState, useEffect } from 'react';
import { KorisnikDTO } from '../types/Korisnik';
import axiosInstance from '../utils/axiosConfig.ts';
import Header from "./Header.tsx";

const Profil = () => {
    const [profileData, setProfileData] = useState<KorisnikDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const fetchProfileData = async () => {
        try {
            const response = await axiosInstance.get('/korisnik/profil');
            return response.data;
        } catch (error) {
            console.error('Greška pri dohvaćanju profila:', error);
            throw error;
        }
    };

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await fetchProfileData();
                setProfileData(data);
            } catch {
                setError('Došlo je do pogreške pri dohvaćanju podataka profila.');
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl">Učitavanje...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl">Nema dostupnih podataka o profilu.</div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto rounded-lg shadow-xl min-w-screen flex flex-col items-center">
            <Header />
            <h1 className="text-3xl mt-3 font-bold mb-6">Moj Profil</h1>
            <div className="space-y-4">
                <div className="p-4 rounded-lg">
                    <p className="text-gray-600">Email</p>
                    <p className="font-semibold">{profileData.email}</p>
                </div>

                {profileData.tip === 'TVRTKA' ? (
                    <>
                        <div className="p-4 rounded-lg">
                            <p className="text-gray-600">Naziv tvrtke</p>
                            <p className="font-semibold">{profileData.nazivTvrtke}</p>
                        </div>
                        <div className="p-4 rounded-lg">
                            <p className="text-gray-600">OIB</p>
                            <p className="font-semibold">{profileData.oib}</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="p-4 rounded-lg">
                            <p className="text-gray-600">Ime</p>
                            <p className="font-semibold">{profileData.ime}</p>
                        </div>
                        <div className="p-4 rounded-lg">
                            <p className="text-gray-600">Prezime</p>
                            <p className="font-semibold">{profileData.prezime}</p>
                        </div>
                    </>
                )}

                <div className="p-4 rounded-lg">
                    <p className="text-gray-600">Adresa</p>
                    <p className="font-semibold">{profileData.adresa}</p>
                </div>
            </div>
        </div>
    );
};

export default Profil;