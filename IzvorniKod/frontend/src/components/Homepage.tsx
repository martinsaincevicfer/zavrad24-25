import Header from './Header';
import {Link} from "react-router-dom";
import {authService} from "../services/authService.ts";

const Homepage = () => {
  const jeHonorarac = authService.isUserInRole('honorarac');

  return (
    <>
      <Header/>
      <div className="max-w-7xl mx-auto min-h-2/5 p-8 flex flex-col items-center justify-between">
        <h1 className="text-4xl font-bold">
          Dobrodošli
        </h1>
        <div className="flex align-baseline justify-between gap-10">
          <Link to="/honorarci"
                className="bg-blue-500 px-4 py-2 text-2xl font-medium dark:text-white dark:hover:text-gray-300">
            Zaposli honorarca
          </Link>

          {jeHonorarac && (
            <Link to="/projekti"
                  className="bg-blue-500 px-4 py-2 text-2xl font-medium dark:text-white dark:hover:text-gray-300">
              Pronađi posao
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Homepage;