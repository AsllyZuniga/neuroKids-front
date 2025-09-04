import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import "./App.css";

const Dashboard = lazy(() => import("./pages/dashboard/dashboard"));
const Prueba = lazy(() => import("./pages/prueba/prueba"));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Cargando...</div>}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/nivel1" element={<Prueba nivel={1} imagen="/niveles/nivel1.svg" lecturas={4} />} />
          <Route path="/nivel2" element={<Prueba nivel={2} imagen="/niveles/nivel2.svg" lecturas={6} />} />
          <Route path="/nivel3" element={<Prueba nivel={3} imagen="/niveles/nivel3.svg" lecturas={8} />} />
          <Route path="/nivel4" element={<Prueba nivel={4} imagen="/niveles/nivel4.svg" lecturas={8} />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
export default App;
