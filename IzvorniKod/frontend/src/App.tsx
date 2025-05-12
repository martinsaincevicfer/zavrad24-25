import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Homepage from "./components/Homepage.tsx";
import {ProjektPopis} from "./components/ProjektPopis.tsx";
import {DetaljiProjekta} from "./components/ProjektDetalji.tsx";
import SlobodnjakPopis from "./components/SlobodnjakPopis.tsx";
import SlobodnjakDetalji from "./components/SlobodnjakDetalji.tsx";
import {PrivateRoute} from "./components/PrivateRoute.tsx";
import {Login} from "./components/Login.tsx";

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route
                path="/homepage"
                element={
                    <PrivateRoute>
                        <Homepage />
                    </PrivateRoute>
                }
            />
            <Route path="/" element={<Navigate to="/homepage" />}/>
            <Route path="/projekti" element={
                <PrivateRoute>
                    <ProjektPopis />
                </PrivateRoute>
                }
            />
            <Route path="/projekti/:id" element={<DetaljiProjekta />} />
            <Route path="/slobodnjaci" element={<SlobodnjakPopis />} />
            <Route path="/slobodnjaci/:id" element={<SlobodnjakDetalji />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
