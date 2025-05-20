import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Homepage from "./components/Homepage.tsx";
import {ProjektPopis} from "./components/ProjektPopis.tsx";
import {DetaljiProjekta} from "./components/ProjektDetalji.tsx";
import SlobodnjakPopis from "./components/SlobodnjakPopis.tsx";
import SlobodnjakDetalji from "./components/SlobodnjakDetalji.tsx";
import PrivateRoute from "./components/PrivateRoute.tsx";
import {Login} from "./components/Login.tsx";
import Profil from "./components/Profil.tsx";
import RegistracijaOsoba from "./components/RegistracijaOsoba.tsx";
import TipRegistracije from "./components/TipRegistracije.tsx";
import RegistracijaTvrtka from "./components/RegistracijaTvrtka.tsx";
import RegistracijaSlobodnjak from "./components/RegistracijaSlobodnjak.tsx";

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/homepage" element={<Homepage />}/>
            <Route path="/" element={<Navigate to="/homepage" />}/>
            <Route path="/login" element={<Login />} />
            <Route path="/registracija" element={<TipRegistracije />} />
            <Route path="/registracija/osoba" element={<RegistracijaOsoba />} />
            <Route path="/registracija/tvrtka" element={<RegistracijaTvrtka />} />
            <Route
                path="/registracija/slobodnjak"
                element={
                    <PrivateRoute>
                        <RegistracijaSlobodnjak />
                    </PrivateRoute>
                }
            />
            <Route path="/profil" element={
                <PrivateRoute>
                    <Profil />
                </PrivateRoute>
            }
            />
            <Route path="/projekti" element={<ProjektPopis />}/>
            <Route path="/projekti/:id" element={
                <PrivateRoute>
                    <DetaljiProjekta />
                </PrivateRoute>
                }
            />
            <Route path="/slobodnjaci" element={<SlobodnjakPopis />} />
            <Route path="/slobodnjaci/:id" element={
                <PrivateRoute>
                    <SlobodnjakDetalji />
                </PrivateRoute>
                }
            />
        </Routes>
    </BrowserRouter>
  )
}

export default App
