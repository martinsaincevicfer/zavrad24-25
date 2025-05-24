import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {House, LogIn, LogOut, Menu, User, UserPlus, X} from "lucide-react";
import {authService} from "../services/authService.ts";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('user');

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
    authService.logout();
    setIsLoggedIn(false);
    setUserEmail(null);
    navigate('/');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="min-w-screen bg-gray-100 dark:bg-black p-4">
      <nav className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-xl font-bold flex items-center gap-1 dark:text-white hover:text-gray-300 dark:hover:text-gray-300"
        >
          <House />
          Naslovnica
        </Link>

        <button
          className="text-xl dark:text-white md:hidden flex items-center"
          onClick={toggleMenu}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <div className={`md:flex gap-4 justify-between items-center hidden`}>
          <Link to="/honorarci" className="px-4 py-2 dark:text-white dark:hover:text-gray-300">
            Zaposli honorarca
          </Link>
          <Link to="/projekti" className="px-4 py-2 dark:text-white dark:hover:text-gray-300">
            Pronađi posao
          </Link>
          {isLoggedIn && userEmail && (
            <Link
              to="/profil"
              className="px-4 py-2 dark:text-white flex items-center gap-1 hover:text-gray-300 dark:hover:text-gray-300"
            >
              <User />
              {userEmail}
            </Link>
          )}
          <button
            className="px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
            onClick={isLoggedIn ? handleLogout : handleLoginClick}
          >
            {isLoggedIn ? (
              <div className="dark:text-white flex items-center gap-1 hover:text-gray-300 dark:hover:text-gray-300">
                <LogOut />
                Odjava
              </div>
            ) : (
              <div className="dark:text-white flex items-center gap-1 hover:text-gray-300 dark:hover:text-gray-300">
                <LogIn />
                Prijava
              </div>
            )}
          </button>
          {!isLoggedIn && (
            <Link
              to="/registracija"
              className="px-4 py-2.5 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300 flex items-center gap-1"
            >
              <UserPlus />
              Registracija
            </Link>
          )}
        </div>

        {menuOpen && (
          <div className="absolute top-16 left-0 w-full bg-gray-100 dark:bg-black flex flex-col items-start gap-4 p-4 md:hidden z-50">
            <Link to="/honorarci" className="dark:text-white hover:text-gray-300">
              Zaposli honorarca
            </Link>
            <Link to="/projekti" className="dark:text-white hover:text-gray-300">
              Pronađi posao
            </Link>
            {isLoggedIn && userEmail && (
              <Link
                to="/profil"
                className="dark:text-white flex items-center gap-1 hover:text-gray-300"
              >
                <User />
                {userEmail}
              </Link>
            )}
            <button
              className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
              onClick={isLoggedIn ? handleLogout : handleLoginClick}
            >
              {isLoggedIn ? (
                <div className="dark:text-white flex items-center gap-1 hover:text-gray-300">
                  <LogOut />
                  Odjava
                </div>
              ) : (
                <div className="dark:text-white flex items-center gap-1 hover:text-gray-300">
                  <LogIn />
                  Prijava
                </div>
              )}
            </button>
            {!isLoggedIn && (
              <Link
                to="/registracija"
                className="bg-green-500 text-white px-5 py-3 rounded hover:bg-green-600 flex items-center gap-1 transition duration-300"
              >
                <UserPlus />
                Registracija
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;