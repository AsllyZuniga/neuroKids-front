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

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Cargando...</div>}>
        <Routes>
          {/* Rutas de autenticación */}
          <Route path="/tipo-usuario" element={<UserType />} />
          <Route path="/docente/login" element={<TeacherLogin />} />
          <Route path="/estudiante/login" element={<StudentLogin />} />
          <Route path="/estudiante/registro" element={<StudentRegister />} />
          
          {/* Rutas de bienvenida */}
          <Route path="/bienvenida/estudiante" element={<StudentWelcome />} />
          <Route path="/bienvenida/docente" element={<TeacherWelcome />} />
          
          {/* Ruta de prueba temporal */}
          <Route path="/test-instituciones" element={<TestInstituciones />} />
          
          {/* Rutas principales */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/nivel1" element={<Prueba nivel={1} imagen="/niveles/nivel1.webp" lecturas={4} />} />
          <Route path="/nivel2" element={<Prueba nivel={2} imagen="/niveles/nivel2.webp" lecturas={6} />} />
          <Route path="/nivel3" element={<Prueba nivel={3} imagen="/niveles/nivel3.webp" lecturas={8} />} />
          <Route path="/nivel4" element={<Prueba nivel={4} imagen="/niveles/nivel4.svg" lecturas={8} />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
export default App;
