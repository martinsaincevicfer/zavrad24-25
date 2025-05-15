import { useNavigate } from 'react-router-dom';
import Header from "./Header.tsx";

const TipRegistracije = () => {
    const navigate = useNavigate();

    const handleChoice = (type: 'osoba' | 'tvrtka') => {
        if (type === 'osoba') {
            navigate('/registracija/osoba');
        } else if (type === 'tvrtka') {
            navigate('/registracija/tvrtka');
        }
    };

    return (
        <div className="max-w-md mx-auto shadow-md rounded min-w-screen">
            <Header />
            <h1 className="text-2xl font-bold mb-6 text-center">Odaberite tip registracije</h1>
            <div className="flex flex-col gap-5 max-w-md mx-auto">
                <button
                    onClick={() => handleChoice('osoba')}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Registracija kao Osoba
                </button>
                <button
                    onClick={() => handleChoice('tvrtka')}
                    className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Registracija kao Tvrtka
                </button>
            </div>
        </div>
    );
};

export default TipRegistracije;