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
import Layout from "./components/Layout.tsx";
import AdminPanel from "./components/AdminPanel.tsx";
import {ConfirmProvider} from "./components/ConfirmContext.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/homepage" element={
          <Layout><Homepage/></Layout>}/>
        <Route path="/" element={<Navigate to="/homepage"/>}/>
        <Route path="/zabranjeno" element={<Layout><ZabranjenPristup/></Layout>}/>
        <Route path="/login" element={<Layout><Login/></Layout>}/>
        <Route path="/registracija/osoba" element={<Layout><RegistracijaOsoba/></Layout>}/>
        <Route path="/registracija/tvrtka" element={<Layout><RegistracijaTvrtka/></Layout>}/>
        <Route
          path="/registracija/ponuditelj"
          element={
            <PrivateRoute requiredRole={'narucitelj'}>
              <Layout><RegistracijaPonuditelj/></Layout>
            </PrivateRoute>
          }/>
        <Route path="/profil" element={
          <PrivateRoute>
            <Layout><Profil/></Layout>
          </PrivateRoute>
        }/>
        <Route path="/projekti" element={<Layout><ProjektPopis/></Layout>}/>
        <Route path="/projekti/:id" element={<Layout>
          <ConfirmProvider>
            <ProjektDetalji/>
          </ConfirmProvider>
        </Layout>}/>
        <Route path="/projekti/:id/uredi" element={
          <PrivateRoute requiredRole={'narucitelj'}>
            <Layout><EditProjekt/></Layout>
          </PrivateRoute>
        }/>
        <Route path="/ponuditelji/:id" element={
          <PrivateRoute requiredRole={'narucitelj'}>
            <Layout><PonuditeljDetalji/></Layout>
          </PrivateRoute>
        }/>
        <Route path="/projekti/stvori" element={
          <PrivateRoute requiredRole={'narucitelj'}>
            <Layout><KreiranjeProjekta/></Layout>
          </PrivateRoute>
        }/>
        <Route path="/korisnik/projekti" element={
          <PrivateRoute requiredRole={'narucitelj'}>
            <Layout><MojiProjekti/></Layout>
          </PrivateRoute>
        }/>
        <Route path="/ponuditelj/ponude" element={
          <PrivateRoute requiredRole={'ponuditelj'}>
            <Layout>
              <ConfirmProvider>
                <MojePonude/>
              </ConfirmProvider>
            </Layout>
          </PrivateRoute>
        }/>
        <Route path="/ugovori" element={
          <PrivateRoute requiredRole={'narucitelj'}>
            <Layout><MojiUgovori/></Layout>
          </PrivateRoute>
        }/>
        <Route path="/ugovori/:id" element={
          <PrivateRoute requiredRole={'narucitelj'}>
            <Layout>
              <ConfirmProvider>
                <UgovorDetalji/>
              </ConfirmProvider>
            </Layout>
          </PrivateRoute>
        }/>
        <Route path="/admin" element={
          <PrivateRoute requiredRole={'administrator'}>
            <Layout>
              <ConfirmProvider>
                <AdminPanel/>
              </ConfirmProvider>
            </Layout>
          </PrivateRoute>
        }/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
