import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Homepage from "./components/Homepage.tsx";
import {ProjektPopis} from "./components/ProjektPopis.tsx";
import {DetaljiProjekta} from "./components/ProjektDetalji.tsx";
import HonoraracPopis from "./components/HonoraracPopis.tsx";
import HonoraracDetalji from "./components/HonoraracDetalji.tsx";
import PrivateRoute from "./components/PrivateRoute.tsx";
import Login from "./components/Login.tsx";
import Profil from "./components/Profil.tsx";
import RegistracijaOsoba from "./components/RegistracijaOsoba.tsx";
import RegistracijaTvrtka from "./components/RegistracijaTvrtka.tsx";
import RegistracijaHonorarac from "./components/RegistracijaHonorarac.tsx";
import KreiranjeProjekta from "./components/KreiranjeProjekta.tsx";
import {MojiProjekti} from "./components/MojiProjekti.tsx";
import MojePrijave from "./components/MojePrijave.tsx";
import MojiUgovori from "./components/MojiUgovori.tsx";
import UgovorDetalji from "./components/UgovorDetalji.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/homepage" element={<Homepage/>}/>
        <Route path="/" element={<Navigate to="/homepage"/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/registracija/osoba" element={<RegistracijaOsoba/>}/>
        <Route path="/registracija/tvrtka" element={<RegistracijaTvrtka/>}/>
        <Route
          path="/registracija/honorarac"
          element={
            <PrivateRoute>
              <RegistracijaHonorarac/>
            </PrivateRoute>
          }
        />
        <Route path="/profil" element={
          <PrivateRoute>
            <Profil/>
          </PrivateRoute>
        }
        />
        <Route path="/projekti" element={<ProjektPopis/>}/>
        <Route path="/projekti/:id" element={<DetaljiProjekta/>}/>
        <Route path="/honorarci" element={<HonoraracPopis/>}/>
        <Route path="/honorarci/:id" element={
          <PrivateRoute>
            <HonoraracDetalji/>
          </PrivateRoute>
        }
        />
        <Route path="/projekti/stvori" element={
          <PrivateRoute>
            <KreiranjeProjekta/>
          </PrivateRoute>
        }
        />
        <Route path="/korisnik/projekti" element={
          <PrivateRoute>
            <MojiProjekti/>
          </PrivateRoute>
        }/>
        <Route path="/honorarac/prijave" element={
          <PrivateRoute>
            <MojePrijave/>
          </PrivateRoute>
        }/>
        <Route path="/ugovori" element={
          <PrivateRoute>
            <MojiUgovori/>
          </PrivateRoute>
        }/>
        <Route path="/ugovori/:id" element={
          <PrivateRoute>
            <UgovorDetalji/>
          </PrivateRoute>
        }/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
