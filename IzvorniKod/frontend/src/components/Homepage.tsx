import Header from './Header';
import {Link} from "react-router-dom";
import {Plus, Search} from "lucide-react";

const Homepage = () => {
  return (
    <>
      <Header/>
      <div className="max-w-7xl mx-auto min-h-2/5 p-8 flex flex-col items-center justify-between gap-5">
        <h1 className="text-4xl font-bold">
          Dobrodošli!
        </h1>
        <h2 className="text-2xl md:text-4xl">
          Poveži se s najboljim stručnjacima. Ostvari svoje projekte.
        </h2>
        <div className="flex flex-col md:flex-row align-baseline justify-between gap-10">
          {/*
          <Link to="/honorarci"
                className="bg-blue-500 px-4 py-2 text-2xl font-medium dark:text-white dark:hover:text-gray-300">
            Zaposli honorarca
          </Link>
          */}

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
      </div>
    </>
  );
};

export default Homepage;