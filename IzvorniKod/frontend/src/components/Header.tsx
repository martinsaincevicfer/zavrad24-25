import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="min-w-screen bg-black shadow-md p-4">
            <nav className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex gap-6 justify-between items-center">
                    <Link
                        to="/"
                        className="text-xl font-bold text-white-800 hover:text-white-600"
                    >
                        Naslovnica
                    </Link>
                    <Link
                        to="/slobodnjaci"
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Zaposli slobodnjaka
                    </Link>
                    <Link
                        to="/projekti"
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Pronađi posao
                    </Link>
                </div>
                
                <div className="flex gap-4">
                    <button 
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Prijava
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default Header;