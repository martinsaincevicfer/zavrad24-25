import { useState, useEffect } from 'react';
import { KorisnikDTO } from '../types/Korisnik';
import { HonoraracDTO } from '../types/Honorarac.ts';
import axiosInstance from '../utils/axiosConfig';
import { authService } from '../services/authService';
import Header from './Header';
import { useNavigate } from 'react-router-dom';

const Profil = () => {
  const [userProfile, setUserProfile] = useState<KorisnikDTO | null>(null);
  const [freelancerProfile, setFreelancerProfile] = useState<HonoraracDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userError, setUserError] = useState<string>('');
  const [freelancerError, setFreelancerError] = useState<string>('');
  const isFreelancer = authService.isUserInRole('honorarac');
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get('/korisnici/profil');
      return response.data;
    } catch (error) {
      console.error('Greška pri dohvaćanju korisničkog profila:', error);
      throw error;
    }
  };

  const fetchFreelancerProfile = async () => {
    try {
      const response = await axiosInstance.get('/honorarci/current');
      return response.data;
    } catch (error) {
      console.error('Greška pri dohvaćanju profila honoraraca:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const userData = await fetchUserProfile();
        setUserProfile(userData);

        if (isFreelancer) {
          const freelancerData = await fetchFreelancerProfile();
          setFreelancerProfile(freelancerData);
        }
      } catch (error) {
        setUserError('Došlo je do pogreške pri dohvaćanju podataka korisničkog profila.');
      } finally {
        setLoading(false);
      }
    };

    loadProfiles();
  }, [isFreelancer]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Učitavanje...</div>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{userError}</div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto rounded-lg shadow-xl flex flex-col items-center">
        <h1 className="text-3xl mt-3 font-bold mb-6">Moj Profil</h1>
        <div className="space-y-4 grid grid-cols-2 gap-4">
          {userProfile && (
            <div>
              <div className="p-4 rounded-lg">
                <p className="text-gray-600">Email</p>
                <p className="font-semibold">{userProfile.email}</p>
              </div>
              {userProfile.tip === 'TVRTKA' ? (
                <>
                  <div className="p-4 rounded-lg">
                    <p className="text-gray-600">Naziv tvrtke</p>
                    <p className="font-semibold">{userProfile.nazivTvrtke}</p>
                  </div>
                  <div className="p-4 rounded-lg">
                    <p className="text-gray-600">OIB</p>
                    <p className="font-semibold">{userProfile.oib}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 rounded-lg">
                    <p className="text-gray-600">Ime</p>
                    <p className="font-semibold">{userProfile.ime}</p>
                  </div>
                  <div className="p-4 rounded-lg">
                    <p className="text-gray-600">Prezime</p>
                    <p className="font-semibold">{userProfile.prezime}</p>
                  </div>
                </>
              )}
              <div className="p-4 rounded-lg">
                <p className="text-gray-600">Adresa</p>
                <p className="font-semibold">{userProfile.adresa}</p>
              </div>
            </div>
          )}

          {isFreelancer ? (
            freelancerProfile ? (
              <div className="space-y-4">
                <div className="p-4 rounded-lg">
                  <p className="text-gray-600">Kratki Opis</p>
                  <p className="font-semibold">{freelancerProfile.kratkiOpis}</p>
                </div>
                <div className="p-4 rounded-lg">
                  <p className="text-gray-600">Edukacija</p>
                  <p className="font-semibold">{freelancerProfile.edukacija}</p>
                </div>
                <div className="p-4 rounded-lg">
                  <p className="text-gray-600">Iskustvo</p>
                  <p className="font-semibold">{freelancerProfile.iskustvo}</p>
                </div>
                <div className="p-4 rounded-lg">
                  <p className="text-gray-600">Datum Stvaranja</p>
                  <p className="font-semibold">{freelancerProfile.datumStvaranja}</p>
                </div>
                <div className="p-4 rounded-lg">
                  <p className="text-gray-600">Vještine</p>
                  <ul className="list-disc list-inside">
                    {freelancerProfile.vjestine.map((vjestina) => (
                      <li key={vjestina.id}>{vjestina.naziv}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-red-500">{freelancerError || 'Podaci o honorarcu nisu dostupni.'}</div>
            )
          ) : (
            <div className="flex flex-col items-center">
              <p className="text-lg font-medium mb-4">Trenutno niste registrirani kao honorarac.</p>
              <button
                onClick={() => navigate('/registracija/honorarac')}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Registriraj se kao honorarac
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profil;