import {useEffect, useState} from 'react';
import axiosInstance from '../utils/axiosConfig';
import {authService} from '../services/authService';
import Header from './Header';
import {Link} from 'react-router-dom';
import {Korisnik} from "../types/Korisnik.ts";
import {Ponuditelj} from "../types/Ponuditelj.ts";


const Profil = () => {
  const [userProfile, setUserProfile] = useState<Korisnik | null>(null);
  const [freelancerProfile, setFreelancerProfile] = useState<Ponuditelj | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userError, setUserError] = useState<string>('');
  const [freelancerError, setFreelancerError] = useState<string>('');
  const jePonuditelj = authService.isUserInRole('ponuditelj');

  const fetchUserProfile = async () => {
    try {
      const response = await axiosInstance.get<Korisnik>('/korisnici/profil');
      return response.data;
    } catch (error) {
      console.error('Greška pri dohvaćanju korisničkog profila:', error);
      throw error;
    }
  };

  const fetchFreelancerProfile = async () => {
    try {
      const response = await axiosInstance.get<Ponuditelj>('/ponuditelji/current');
      return response.data;
    } catch (error) {
      console.error('Greška pri dohvaćanju profila ponuditelja:', error);
      setFreelancerError('Došlo je do pogreške pri dohvaćanju profila ponuditelja.');
      throw error;
    }
  };

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const userData = await fetchUserProfile();
        setUserProfile(userData);

        if (jePonuditelj) {
          const freelancerData = await fetchFreelancerProfile();
          setFreelancerProfile(freelancerData);
        }
      } catch (error) {
        console.error('Greška pri dohvaćanju profila ponuditelja:', error);
        setUserError('Došlo je do pogreške pri dohvaćanju podataka korisničkog profila.');
      } finally {
        setLoading(false);
      }
    };

    loadProfiles();
  }, [jePonuditelj]);

  if (loading) {
    return (
      <>
        <Header/>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-xl">Učitavanje...</div>
        </div>
      </>
    );
  }
  if (userError) {
    return (
      <>
        <Header/>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-red-500">{userError}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header/>
      <div className="container max-w-7xl mx-auto mt-8 px-3 sm:px-6 lg:px-9 flex flex-col items-center">
        <h1 className="text-3xl mt-3 font-bold mb-6">Moj Profil</h1>
        <div className="space-y-4 grid grid-cols-2 gap-4">
          {userProfile && (
            <div>
              <div className="p-4 rounded-lg">
                <p className="text-gray-600">Email</p>
                <p className="font-semibold">{userProfile.email}</p>
              </div>
              {userProfile.tip === 'tvrtka' ? (
                <>
                  {'nazivTvrtke' in userProfile && (
                    <div className="p-4 rounded-lg">
                      <p className="text-gray-600">Naziv tvrtke</p>
                      <p className="font-semibold">{userProfile.nazivTvrtke}</p>
                    </div>
                  )}
                  {'oib' in userProfile && (
                    <div className="p-4 rounded-lg">
                      <p className="text-gray-600">OIB</p>
                      <p className="font-semibold">{userProfile.oib}</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {'ime' in userProfile && (
                    <div className="p-4 rounded-lg">
                      <p className="text-gray-600">Ime</p>
                      <p className="font-semibold">{userProfile.ime}</p>
                    </div>
                  )}
                  {'prezime' in userProfile && (
                    <div className="p-4 rounded-lg">
                      <p className="text-gray-600">Prezime</p>
                      <p className="font-semibold">{userProfile.prezime}</p>
                    </div>
                  )}
                </>
              )}
              <div className="p-4 rounded-lg">
                <p className="text-gray-600">Adresa</p>
                <p className="font-semibold">{userProfile.adresa}</p>
              </div>
            </div>
          )}

          {jePonuditelj ? (
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
                  <div className="flex flex-wrap gap-2 mt-1">
                    {freelancerProfile.vjestine.map((vjestina) => (
                      <span
                        key={vjestina.id}
                        className="text-black bg-blue-300 text-xs px-2 py-1 roundedbg-blue-300 rounded-full"
                      >{vjestina.naziv}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-red-500">{freelancerError || 'Podaci o ponuditelju nisu dostupni.'}</div>
            )
          ) : (
            <div className="flex flex-col items-center">
              <p className="text-lg font-medium mb-4">Trenutno niste registrirani kao ponuditelj.</p>
              <Link
                to={'/registracija/ponuditelj'}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Registriraj se kao ponuditelj
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profil;