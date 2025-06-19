import {Link} from "react-router-dom";
import {Plus, Search} from "lucide-react";
import {authService} from "../services/authService.ts";
import homepageImg from '../assets/homepage1.jpg';

const Homepage = () => {
  const jeAdministrator = authService.isUserInRole('administrator');

  return (
    <div className="min-h-screen">
      <div
        className="relative h-[70vh] w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{backgroundImage: `url(${homepageImg})`}}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white dark:to-gray-900"/>
        <div className="relative z-10 flex flex-col items-center justify-center gap-5 w-full">
          {jeAdministrator && (
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">
              Dobrodošli!
            </h1>
          )}
          {!jeAdministrator && (
            <div className="flex flex-col items-center justify-center gap-5">
              <h2 className="text-2xl md:text-4xl text-white drop-shadow-lg font-bold text-center">
                Poveži se s najboljim stručnjacima. Ostvari svoje projekte.
              </h2>
              <div className="flex flex-col md:flex-row items-center justify-center gap-10">
                <Link
                  to="/projekti"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xl font-medium flex items-center gap-1"
                >
                  <Search/>
                  Pronađi posao
                </Link>
                <Link
                  to="/projekti/stvori"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xl font-medium flex items-center gap-1"
                >
                  <Plus/>
                  Registriraj projekt
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* More content below the image section */}
      <div className="flex flex-col items-center justify-center gap-5 px-4 py-8">
        {/* Add more text or content here */}
      </div>
    </div>
  );
};

export default Homepage;