import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import FloatingActions from "./components/FloatingActions/FloatingActions";
import Home from "./pages/Home/Home";
import Testimonios from "./pages/Testimonios/Testimonios";
import TestimonioDetalle from "./pages/Testimonios/TestimonioDetalle";
import Informacion from "./pages/Informacion/Informacion";
import Instituciones from "./pages/Instituciones/Instituciones";
import Chat from "./pages/Chat/Chat";
import Comparte from "./pages/Comparte/Comparte";
import Estadisticas from "./pages/Estadisticas/Estadisticas";
import Login from "./pages/Login/Login";
import SetupPerfil from "./pages/SetupPerfil/SetupPerfil";
import AdminDashboard from "./pages/Admin/AdminDashboard";

function Layout({ children, noFooter }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F9F9F9" }}>
      <Header />
      <main className="flex-1">{children}</main>
      {!noFooter && <Footer />}
      <FloatingActions />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Públicas */}
          <Route path="/"                element={<Layout><Home /></Layout>} />
          <Route path="/testimonios"     element={<Layout><Testimonios /></Layout>} />
          <Route path="/testimonios/:id" element={<Layout><TestimonioDetalle /></Layout>} />
          <Route path="/informacion"     element={<Layout><Informacion /></Layout>} />
          <Route path="/instituciones"   element={<Layout><Instituciones /></Layout>} />
          <Route path="/chat"            element={<Layout noFooter><Chat /></Layout>} />

          {/* Requiere sesión */}
          <Route path="/comparte"        element={<Layout><Comparte /></Layout>} />

          {/* Auth */}
          <Route path="/login"           element={<Login />} />
          <Route path="/setup-perfil"    element={<SetupPerfil />} />

          {/* Admin (protegido internamente) */}
          <Route path="/admin"           element={<Layout><AdminDashboard /></Layout>} />

          {/* Legacy */}
          <Route path="/estadisticas"    element={<Layout><Estadisticas /></Layout>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
