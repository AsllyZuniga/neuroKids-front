import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
const Dashboard = lazy(() => import("./pages/dashboard/dashboard"));
const Prueba = lazy(() => import("./pages/prueba/prueba"));
const UserType = lazy(() => import("./pages/userType/userType"));
const TeacherLogin = lazy(() => import("./pages/teacherLogin/teacherLogin"));
const StudentLogin = lazy(() => import("./pages/studentLogin/studentLogin"));
const StudentRegister = lazy(() => import("./pages/studentRegister/studentRegister"));
const StudentWelcome = lazy(() => import("./pages/studentWelcome/studentWelcome"));
const TeacherWelcome = lazy(() => import("./pages/teacherWelcome/teacherWelcome"));
const AdminLogin = lazy(() => import("./pages/adminLogin/adminLogin"));
const AdminWelcome = lazy(() => import("./pages/adminWelcome/adminWelcome"));
const Docentes = lazy(() => import("./pages/docentes/docentes"));
const Instituciones = lazy(() => import("./pages/instituciones/instituciones"));
const Reportes = lazy(() => import("./pages/reportes/reportes"));
const TestInstituciones = lazy(() => import("./pages/testInstituciones/testInstituciones"));
const Estudiantes = lazy(() => import("./pages/estudiantes/estudiantes"));

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
  const goToLevel1Dashboard = () => {
    window.location.assign("/nivel1");
  };
  const goToLevel2Dashboard = () => {
    window.location.assign("/nivel2");
  };
  const goToLevel3Dashboard = () => {
    window.location.assign("/nivel3");
  };

  return (
    <Router>
      <Suspense
        fallback={
          <div
            style={{
              minHeight: "100vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: '"OpenDyslexic"',
              color: "#64748b",
              background: "linear-gradient(to bottom right, #eff6ff, #faf5ff)",
            }}
          >
            Cargando…
          </div>
        }
      >
        <Routes>
          <Route path="/tipo-usuario" element={<UserType />} />
          <Route path="/docente/login" element={<TeacherLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/perfil/admin" element={<AdminWelcome />} />
          <Route path="/docentes" element={<Docentes />} />
          <Route path="/instituciones" element={<Instituciones />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/lecturas" element={<Navigate to="/perfil/admin" replace />} />
          <Route path="/estudiante/login" element={<StudentLogin />} />
          <Route path="/estudiante/registro" element={<StudentRegister />} />
          <Route path="/bienvenida/estudiante" element={<Dashboard />} />
          <Route path="/perfil/estudiante" element={<StudentWelcome />} />
          <Route path="/perfil/docente" element={<TeacherWelcome />} />
          <Route path="/bienvenida/docente" element={<TeacherWelcome />} />
          <Route path="/test-instituciones" element={<TestInstituciones />} />
          <Route path="/estudiantes" element={<Estudiantes />} />

          <Route path="/" element={<Dashboard />} />

          <Route
            path="/nivel1"
            element={<Prueba nivel={1} imagen="/niveles/nivel1.png" lecturas={3} games={3} />}
          />
          <Route
            path="/nivel2"
            element={<Prueba nivel={2} imagen="/niveles/nivel2.png" lecturas={3} games={3} />}
          />
          <Route
            path="/nivel3"
            element={<Prueba nivel={3} imagen="/niveles/nivel3.png" lecturas={3} games={3} />}
          />

          <Route path="/nivel1/juego1" element={<BingoPalabras onBack={goToLevel1Dashboard} />} />
          <Route path="/nivel1/juego2" element={<CazaSilaba onBack={goToLevel1Dashboard} level={1} onFinishLevel={() => {/* Implement your finish logic here */}}/>}/>
          <Route path="/nivel1/juego3" element={<EscuchaElige onBack={goToLevel1Dashboard} level={1} />} />
          <Route path="/nivel1/lectura1" element={<CuentoPictogramas onBack={goToLevel1Dashboard} />} />
          <Route path="/nivel1/lectura2" element={<FrasesMagicas onBack={goToLevel1Dashboard} level={1} />} />
          <Route path="/nivel1/lectura3" element={<PrimeraPalabra onBack={goToLevel1Dashboard} />} />


          <Route path="/nivel2/juego1" element={<ConstruyeFrase onBack={goToLevel2Dashboard} level={1}/>} />
          <Route path="/nivel2/juego2" element={<LaberintoLector onBack={goToLevel2Dashboard} level={1}/>}/>
          <Route path="/nivel2/juego3" element={<OrdenaHistoria onBack={goToLevel2Dashboard}  />} />
          <Route path="/nivel2/lectura1" element={<HistoriasInteractivas onBack={goToLevel2Dashboard} level={1} onNextLevel={() => {}}/>}/>
          <Route path="/nivel2/lectura2" element={<MiniAventuras onBack={goToLevel2Dashboard} level={1} />} />
          <Route path="/nivel2/lectura3" element={<RevistaInfantil onBack={goToLevel2Dashboard} level={1} onNextLevel={() => {}}/>} />


          <Route path="/nivel3/juego1" element={<CoheteLector onBack={goToLevel3Dashboard} level={1}/>} />
          <Route path="/nivel3/juego2" element={<DetectivePalabras onBack={goToLevel3Dashboard} level={1}/>}/>
          <Route path="/nivel3/juego3" element={<PreguntasInferenciales onBack={goToLevel3Dashboard} />} />
          <Route path="/nivel3/lectura1" element={<BiografiasSencillas onBack={goToLevel3Dashboard} />} />
          <Route path="/nivel3/lectura2" element={<CuentoInteractivo onBack={goToLevel3Dashboard} level={1} />} />
          <Route path="/nivel3/lectura3" element={<NoticiasSencillas onBack={goToLevel3Dashboard} level={1}/>} />

        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
