import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Homepage from "./components/Homepage.tsx";
import {ProjektPopis} from "./components/ProjektPopis.tsx";
import {ProjektDetalji} from "./components/ProjektDetalji.tsx";
import PonuditeljDetalji from "./components/PonuditeljDetalji.tsx";
import PrivateRoute from "./components/PrivateRoute.tsx";
import Login from "./components/Login.tsx";
import Profil from "./components/Profil.tsx";
import RegistracijaOsoba from "./components/RegistracijaOsoba.tsx";
import RegistracijaTvrtka from "./components/RegistracijaTvrtka.tsx";
import RegistracijaPonuditelj from "./components/RegistracijaPonuditelj.tsx";
import KreiranjeProjekta from "./components/KreiranjeProjekta.tsx";
import {MojiProjekti} from "./components/MojiProjekti.tsx";
import MojePonude from "./components/MojePonude.tsx";
import MojiUgovori from "./components/MojiUgovori.tsx";
import UgovorDetalji from "./components/UgovorDetalji.tsx";
import EditProjekt from "./components/EditProjekt.tsx";
import ZabranjenPristup from "./components/ZabranjenPristup.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/homepage" element={<Homepage/>}/>
        <Route path="/" element={<Navigate to="/homepage"/>}/>
        <Route path="/zabranjeno" element={<ZabranjenPristup/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/registracija/osoba" element={<RegistracijaOsoba/>}/>
        <Route path="/registracija/tvrtka" element={<RegistracijaTvrtka/>}/>
        <Route
          path="/registracija/ponuditelj"
          element={
            <PrivateRoute>
              <RegistracijaPonuditelj/>
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
        <Route path="/projekti/:id" element={<ProjektDetalji/>}/>
        <Route path="/projekti/:id/uredi" element={
          <PrivateRoute>
            <EditProjekt/>
          </PrivateRoute>
        }
        />
        <Route path="/ponuditelji/:id" element={
          <PrivateRoute>
            <PonuditeljDetalji/>
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
        <Route path="/ponuditelj/ponude" element={
          <PrivateRoute requiredRole={'ponuditelj'}>
            <MojePonude/>
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
