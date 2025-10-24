import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

// Páginas existentes
const Dashboard = lazy(() => import("./pages/dashboard/dashboard"));
const Prueba = lazy(() => import("./pages/prueba/prueba"));

// Páginas de autenticación
const UserType = lazy(() => import("./pages/userType/userType"));
const TeacherLogin = lazy(() => import("./pages/teacherLogin/teacherLogin"));
const StudentLogin = lazy(() => import("./pages/studentLogin/studentLogin"));
const StudentRegister = lazy(() => import("./pages/studentRegister/studentRegister"));

// Páginas de bienvenida
const StudentWelcome = lazy(() => import("./pages/studentWelcome/studentWelcome"));
const TeacherWelcome = lazy(() => import("./pages/teacherWelcome/teacherWelcome"));

// Página de prueba temporal
const TestInstituciones = lazy(() => import("./pages/testInstituciones/testInstituciones"));

// 🧩 Importa los juegos y lecturas del nivel 7–8 años
import { BingoPalabras } from "./components/edades/Edad7_8/Juegos/BingoPalabras";
import { EscuchaElige } from "./components/edades/Edad7_8/Juegos/EscuchaElige";
import { CuentoPictogramas } from "./components/edades/Edad7_8/Lecturas/CuentoPictogramas";
import { FrasesMagicas } from "./components/edades/Edad7_8/Lecturas/FrasesMagicas";
import { PrimeraPalabra } from "./components/edades/Edad7_8/Lecturas/PrimeraPalabra";
import { CazaSilaba } from "./components/edades/Edad7_8/Juegos/CazaSilaba";
import { ConstruyeFrase } from "./components/edades/Edad9_10/Juegos/ConstruyeFrase";
import { LaberintoLector } from "./components/edades/Edad9_10/Juegos/LaberintoLector";
import { OrdenaHistoria } from "./components/edades/Edad9_10/Juegos/OrdenaHistoria";
import { HistoriasInteractivas } from "./components/edades/Edad9_10/Lecturas/HistoriasInteractivas";
import { MiniAventuras } from "./components/edades/Edad9_10/Lecturas/MiniAventuras";
import { RevistaInfantil } from "./components/edades/Edad9_10/Lecturas/RevistaInfantil";
import { CoheteLector } from "./components/edades/Edad11_12/Juegos/CoheteLector";
import { DetectivePalabras } from "./components/edades/Edad11_12/Juegos/DetectivePalabras";
import { PreguntasInferenciales } from "./components/edades/Edad11_12/Juegos/PreguntasInferenciales";
import { BiografiasSencillas } from "./components/edades/Edad11_12/Lecturas/BiografiasSencillas";
import { CuentoInteractivo } from "./components/edades/Edad11_12/Lecturas/CuentoInteractivo";
import { NoticiasSencillas } from "./components/edades/Edad11_12/Lecturas/NoticiasSencillas";

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Cargando...</div>}>
        <Routes>
          {/* 🔐 Rutas de autenticación */}
          <Route path="/tipo-usuario" element={<UserType />} />
          <Route path="/docente/login" element={<TeacherLogin />} />
          <Route path="/estudiante/login" element={<StudentLogin />} />
          <Route path="/estudiante/registro" element={<StudentRegister />} />

          {/* 👋 Rutas de bienvenida */}
          <Route path="/bienvenida/estudiante" element={<StudentWelcome />} />
          <Route path="/bienvenida/docente" element={<TeacherWelcome />} />

          {/* 🧪 Ruta de prueba temporal */}
          <Route path="/test-instituciones" element={<TestInstituciones />} />

          {/* 🏠 Rutas principales */}
          <Route path="/" element={<Dashboard />} />

          {/* 🧩 Niveles */}
          <Route
            path="/nivel1"
            element={<Prueba nivel={1} imagen="/niveles/nivel1.webp" lecturas={3} games={3} />}
          />
          <Route
            path="/nivel2"
            element={<Prueba nivel={2} imagen="/niveles/nivel2.webp" lecturas={3} games={3} />}
          />
          <Route
            path="/nivel3"
            element={<Prueba nivel={3} imagen="/niveles/nivel3.webp" lecturas={3} games={3} />}
          />

          {/* 🎮 Rutas de juegos (Nivel 1) */}
          <Route path="/nivel1/juego1" element={<BingoPalabras onBack={() => window.history.back()} />} />
          <Route path="/nivel1/juego2" element={<CazaSilaba onBack={() => window.history.back()}level={1}onFinishLevel={() => {/* Implement your finish logic here */}}/>}/>
          <Route path="/nivel1/juego3" element={<EscuchaElige onBack={() => window.history.back()} level={1} />} />

          {/* 📚 Rutas de lecturas (Nivel 1) */}
          <Route path="/nivel1/lectura1" element={<CuentoPictogramas onBack={() => window.history.back()} />} />
          <Route path="/nivel1/lectura2" element={<FrasesMagicas onBack={() => window.history.back()} level={1} />} />
          <Route path="/nivel1/lectura3" element={<PrimeraPalabra onBack={() => window.history.back()} />} />


          {/* 🎮 Rutas de juegos (Nivel 2) */}
          <Route path="/nivel2/juego1" element={<ConstruyeFrase onBack={() => window.history.back()} level={1}/>} />
          <Route path="/nivel2/juego2" element={<LaberintoLector onBack={() => window.history.back()} level={1}/>}/>
          <Route path="/nivel2/juego3" element={<OrdenaHistoria onBack={() => window.history.back()} level={1} />} />

          {/* 📚 Rutas de lecturas (Nivel 2) */}
          <Route path="/nivel2/lectura1" element={<HistoriasInteractivas onBack={() => window.history.back()} level={1} />} />
          <Route path="/nivel2/lectura2" element={<MiniAventuras onBack={() => window.history.back()} level={1} />} />
          <Route path="/nivel2/lectura3" element={<RevistaInfantil onBack={() => window.history.back()} level={1}/>} />

          {/* 🎮 Rutas de juegos (Nivel 3) */}
          <Route path="/nivel3/juego1" element={<CoheteLector onBack={() => window.history.back()} level={1}/>} />
          <Route path="/nivel3/juego2" element={<DetectivePalabras onBack={() => window.history.back()} level={1}/>}/>
          <Route path="/nivel3/juego3" element={<PreguntasInferenciales onBack={() => window.history.back()} level={1} />} />

          {/* 📚 Rutas de lecturas (Nivel 2) */}
          <Route path="/nivel3/lectura1" element={<BiografiasSencillas onBack={() => window.history.back()} level={1} />} />
          <Route path="/nivel3/lectura2" element={<CuentoInteractivo onBack={() => window.history.back()} level={1} />} />
          <Route path="/nivel3/lectura3" element={<NoticiasSencillas onBack={() => window.history.back()} level={1}/>} />

        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
