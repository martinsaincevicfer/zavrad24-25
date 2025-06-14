import {Link} from "react-router-dom";
import {Plus, Search} from "lucide-react";
import {authService} from "../services/authService.ts";

const Homepage = () => {
  const jeAdministrator = authService.isUserInRole('administrator');

  return (
    <div className="flex flex-col items-center justify-between gap-5 pt-5">
      <h1 className="text-4xl font-bold">
        Dobrodošli!
      </h1>
      {!jeAdministrator && (
        <>
          <h2 className="text-2xl md:text-4xl">
            Poveži se s najboljim stručnjacima. Ostvari svoje projekte.
          </h2>
          <div className="flex flex-col md:flex-row align-baseline justify-between gap-10">
            <Link
              to="/projekti"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xl font-medium  flex items-center gap-1"
            >
              <Search/>
              Pronađi posao
            </Link>
            <Link
              to="/projekti/stvori"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600  text-white text-xl font-medium flex items-center gap-1"
            >
              <Plus/>
              Napravi projekt
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Homepage;