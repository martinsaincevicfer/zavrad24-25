import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "./Header.tsx";
import axios from 'axios';

const RegistracijaOsoba = () => {
    const [formData, setFormData] = useState({
        email: '',
        lozinka: '',
        ime: '',
        prezime: '',
        adresa: ''
    });
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('/api/auth/register/osoba', formData);
            alert('Registracija uspješna!');
            navigate('/login');
        } catch (error: any) {
            console.error('Greška prilikom registracije:', error);
            alert('Došlo je do greške. Pokušajte ponovno.');
        }
    };

    return (
        <div className="max-w-md mx-auto min-w-screen shadow-md rounded">
            <Header />
            <h1 className="text-2xl font-bold mb-6 text-center">Registracija</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto">
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="p-2 border rounded"
                />
                <input
                    type="password"
                    name="lozinka"
                    placeholder="Lozinka"
                    value={formData.lozinka}
                    onChange={handleChange}
                    required
                    className="p-2 border rounded"
                />
                <input
                    type="text"
                    name="ime"
                    placeholder="Ime"
                    value={formData.ime}
                    onChange={handleChange}
                    required
                    className="p-2 border rounded"
                />
                <input
                    type="text"
                    name="prezime"
                    placeholder="Prezime"
                    value={formData.prezime}
                    onChange={handleChange}
                    required
                    className="p-2 border rounded"
                />
                <input
                    type="text"
                    name="adresa"
                    placeholder="Adresa"
                    value={formData.adresa}
                    onChange={handleChange}
                    required
                    className="p-2 border rounded"
                />
                <button
                    type="submit"
                    className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Registriraj se
                </button>
            </form>
        </div>
    );
};

export default RegistracijaOsoba;