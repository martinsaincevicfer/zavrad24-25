import {Link, useNavigate} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {
  ArrowUpFromLine,
  FileText,
  FileUser,
  House,
  LogIn,
  LogOut,
  Menu,
  Moon,
  Plus,
  Search,
  ShieldUser,
  Sun,
  User,
  UserPlus,
  X
} from "lucide-react";
import {authService} from "../services/authService.ts";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const [jeNarucitelj, setJeNarucitelj] = useState(false);
  const [jePonuditelj, setJePonuditelj] = useState(false);
  const [jeAdministrator, setJeAdministrator] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(
    localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const updateAuth = () => {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('user');
      setIsLoggedIn(!!token);
      setUserEmail(email || null);
      setJeNarucitelj(authService.isUserInRole('narucitelj'));
      setJePonuditelj(authService.isUserInRole('ponuditelj'));
      setJeAdministrator(authService.isUserInRole('administrator'));
    };

    updateAuth();

    window.addEventListener('rolesChanged', updateAuth);
    window.addEventListener('authChanged', updateAuth);

    return () => {
      window.removeEventListener('rolesChanged', updateAuth);
      window.removeEventListener('authChanged', updateAuth);
    };
  }, []);

  useEffect(() => {
    const updateRoles = () => {
      setJeNarucitelj(authService.isUserInRole('narucitelj'));
      setJePonuditelj(authService.isUserInRole('ponuditelj'));
      setJeAdministrator(authService.isUserInRole('administrator'));
    };

    updateRoles();

    window.addEventListener('rolesChanged', updateRoles);

    return () => {
      window.removeEventListener('rolesChanged', updateRoles);
    };
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
    <header
      className="min-w-screen fixed top-0 left-0 w-full z-50 bg-gray-100 dark:bg-black bg-opacity-80 backdrop-blur h-16">
      <nav className="max-w-8xl mx-auto flex justify-between items-center px-4 h-full">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-xl font-bold flex items-center gap-1 dark:text-white hover:text-gray-300 dark:hover:text-gray-300"
          >
            <House/>
            Naslovnica
          </Link>

          <div className={`lg:flex gap-4 justify-between items-center hidden`}>
            {jePonuditelj && (
              <Link
                to="/projekti"
                className="px-4 py-2 text-white hover:text-gray-300 flex items-center gap-1"
              >
                <Search/>
                Pronađi posao
              </Link>
            )}

            {isLoggedIn && !jeAdministrator && jeNarucitelj && (
              <Link
                to="/korisnik/projekti"
                className="px-4 py-2 dark:text-white dark:hover:text-gray-300 flex items-center gap-1 hover:text-gray-300"
              >
                <FileText/>
                Moji projekti
              </Link>
            )}

            {jePonuditelj && !jeAdministrator && (
              <div className="flex gap-2">
                <Link to="/ponuditelj/ponude"
                      className="px-4 py-2 dark:text-white dark:hover:text-gray-300 flex items-center gap-1">
                  <ArrowUpFromLine/>
                  Moje ponude
                </Link>
              </div>
            )}

            {isLoggedIn && !jeAdministrator && jeNarucitelj && (
              <Link
                to="/ugovori"
                className="px-4 py-2 dark:text-white dark:hover:text-gray-300 flex items-center gap-1 hover:text-gray-300">
                <FileUser/>
                Moji ugovori
              </Link>
            )}
            {isLoggedIn && jeAdministrator && (
              <Link
                to="/admin"
                className="px-4 py-2 dark:text-white dark:hover:text-gray-300 flex items-center gap-1 hover:text-gray-300">
                <ShieldUser/>
                Admin
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 lg:hidden">
          <button
            onClick={toggleTheme}
            className="ml-4 px-2 py-1 rounded text-black dark:text-white"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Moon/>
            ) : (
              <Sun/>
            )}
          </button>

          <button
            className="text-xl dark:text-white lg:hidden flex items-center"
            onClick={toggleMenu}
          >
            {menuOpen ? <X/> : <Menu/>}
          </button>
        </div>

        <div className={`lg:flex gap-4 justify-between items-center hidden`}>
          <button
            onClick={toggleTheme}
            className="ml-4 px-2 py-1 rounded text-black dark:text-white"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Moon/>
            ) : (
              <Sun/>
            )}
          </button>

          {isLoggedIn && !jeAdministrator && jeNarucitelj && (
            <Link
              to="/projekti/stvori"
              className="px-4 py-2 hover:text-gray-300 text-white flex items-center gap-1"
            >
              <Plus/>
              Napravi projekt
            </Link>
          )}

          {isLoggedIn && userEmail && (
            <Link
              to="/profil"
              className="px-4 py-2 dark:text-white flex items-center gap-1 hover:text-gray-300"
            >
              <User/>
              {userEmail}
            </Link>
          )}

          <button
            className="px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
            onClick={isLoggedIn ? handleLogout : handleLoginClick}
          >
            {isLoggedIn ? (
              <div className="dark:text-white flex items-center gap-1 hover:text-gray-300 dark:hover:text-gray-300">
                <LogOut/>
                Odjava
              </div>
            ) : (
              <div className="dark:text-white flex items-center gap-1 hover:text-gray-300 dark:hover:text-gray-300">
                <LogIn/>
                Prijava
              </div>
            )}
          </button>
          {!isLoggedIn && (
            <Link
              to="/registracija/osoba"
              className="px-4 py-2.5 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300 flex items-center gap-1"
            >
              <UserPlus/>
              Registracija
            </Link>
          )}
        </div>

        {menuOpen && (
          <div
            className="absolute top-16 left-0 w-full bg-gray-100 dark:bg-black flex flex-col items-start gap-4 p-4 lg:hidden z-50">
            {jePonuditelj && (
              <Link
                to="/projekti"
                className="text-white flex items-center gap-1"
              >
                <Search/>
                Pronađi posao
              </Link>
            )}

            {isLoggedIn && !jeAdministrator && jeNarucitelj && (
              <Link
                to="/korisnik/projekti"
                className="dark:text-white dark:hover:text-gray-300 flex items-center gap-1 hover:text-gray-300"
              >
                <FileUser/>
                Moji projekti
              </Link>
            )}

            {jePonuditelj && !jeAdministrator && (
              <div className="flex flex-col items-start gap-2">
                <Link to="/ponuditelj/ponude"
                      className="dark:text-white dark:hover:text-gray-300 flex items-center gap-1">
                  <ArrowUpFromLine/>
                  Moje ponude
                </Link>
              </div>
            )}

            {isLoggedIn && !jeAdministrator && (
              <Link
                to="/ugovori"
                className="dark:text-white dark:hover:text-gray-300 flex items-center gap-1 hover:text-gray-300">
                <FileUser/>
                Moji ugovori
              </Link>
            )}

            {isLoggedIn && jeAdministrator && (
              <Link
                to="/admin"
                className="dark:text-white dark:hover:text-gray-300 flex items-center gap-1 hover:text-gray-300">
                <ShieldUser/>
                Admin
              </Link>
            )}

            {isLoggedIn && !jeAdministrator && (
              <Link
                to="/projekti/stvori"
                className="text-white flex items-center gap-1"
              >
                <Plus/>
                Napravi projekt
              </Link>
            )}

            <div className="flex items-center gap-4">
              {isLoggedIn && userEmail && (
                <Link
                  to="/profil"
                  className="dark:text-white flex items-center gap-1 hover:text-gray-300"
                >
                  <User/>
                  {userEmail}
                </Link>
              )}
              <button
                className="text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
                onClick={isLoggedIn ? handleLogout : handleLoginClick}
              >
                {isLoggedIn ? (
                  <div className="dark:text-white flex items-center gap-1 hover:text-gray-300">
                    <LogOut/>
                    Odjava
                  </div>
                ) : (
                  <div className="dark:text-white flex items-center gap-1 hover:text-gray-300">
                    <LogIn/>
                    Prijava
                  </div>
                )}
              </button>
            </div>

            {!isLoggedIn && (
              <Link
                to="/registracija/osoba"
                className="bg-green-500 text-white px-5 py-3 rounded hover:bg-green-600 flex items-center gap-1 transition duration-300"
              >
                <UserPlus/>
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