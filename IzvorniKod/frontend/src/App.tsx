import {BrowserRouter, Route, Routes} from "react-router-dom";
import Homepage from "./components/Homepage.tsx";
import {PopisProjekata} from "./components/PopisProjekata.tsx";
import {DetaljiProjekta} from "./components/DetaljiProjekt.tsx";

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" Component={Homepage} />
            <Route path="/projekti" element={<PopisProjekata />} />
            <Route path="/projekti/:id" element={<DetaljiProjekta />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
