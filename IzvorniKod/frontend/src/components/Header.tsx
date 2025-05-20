import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("user");

        setIsLoggedIn(!!token);

        if (email) {
            try {
                setUserEmail(email || null);
            } catch (error) {
                console.error("Neispravan format podataka u localStorage za ključ 'user'.", error);
                setUserEmail(null);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setUserEmail(null);
        navigate("/");
    };

    const handleLoginClick = () => {
        navigate("/login");
    };

    return (
        <header className="min-w-screen bg-black shadow-md p-4">
            <nav className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex gap-6 justify-between items-center">
                    <Link
                        to="/"
                        className="text-xl font-bold text-white hover:text-gray-300"
                    >
                        Naslovnica
                    </Link>
                    <Link
                        to="/slobodnjaci"
                        className="px-4 py-2 text-white hover:text-gray-300"
                    >
                        Zaposli slobodnjaka
                    </Link>
                    <Link
                        to="/projekti"
                        className="px-4 py-2 text-white hover:text-gray-300"
                    >
                        Pronađi posao
                    </Link>
                </div>

                <div className="flex gap-4 justify-between items-center">
                    {isLoggedIn && userEmail && (
                        <Link
                            to="/profil"
                            className="px-4 py-2 text-white"
                        >
                            {userEmail} {/* Zamjena "Profil" s korisničkim emailom */}
                        </Link>
                    )}
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                        onClick={isLoggedIn ? handleLogout : handleLoginClick}
                    >
                        {isLoggedIn ? "Odjava" : "Prijava"}
                    </button>
                    {!isLoggedIn && (
                        <Link
                            to="/registracija"
                            className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition duration-300"
                        >
                            Registracija
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;