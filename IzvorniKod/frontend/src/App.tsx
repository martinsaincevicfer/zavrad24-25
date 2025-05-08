import {BrowserRouter, Route, Routes} from "react-router-dom";
import Homepage from "./components/Homepage.tsx";
import {ProjektPopis} from "./components/ProjektPopis.tsx";
import {DetaljiProjekta} from "./components/ProjektDetalji.tsx";
import SlobodnjakPopis from "./components/SlobodnjakPopis.tsx";
import SlobodnjakDetalji from "./components/SlobodnjakDetalji.tsx";

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" Component={Homepage} />
            <Route path="/projekti" element={<ProjektPopis />} />
            <Route path="/projekti/:id" element={<DetaljiProjekta />} />
            <Route path="/slobodnjaci" element={<SlobodnjakPopis />} />
            <Route path="/slobodnjaci/:id" element={<SlobodnjakDetalji />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
