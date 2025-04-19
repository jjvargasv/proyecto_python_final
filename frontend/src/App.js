import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Inicio from "./pages/Inicio";
import Productos from "./pages/Productos";
import Categorias from "./pages/Categorias";
import Contacto from "./pages/Contacto";
import Carrito from "./pages/Carrito";
import DetalleProducto from "./pages/DetalleProducto";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Perfil from "./pages/Perfil";
import Checkout from "./pages/Checkout";
import Ordenes from "./pages/Ordenes";
import AdminProductos from "./pages/AdminProductos";
import AdminProductoForm from "./pages/AdminProductoForm";
import AdminCategorias from "./pages/AdminCategorias";
import AdminImagenes from "./pages/AdminImagenes";
import AdminProductoEliminar from "./pages/AdminProductoEliminar";
import AdminUsuarios from "./pages/AdminUsuarios";
import Acerca from "./pages/Acerca";
import PoliticaPrivacidad from "./pages/PoliticaPrivacidad";
import PreguntasFrecuentes from "./pages/PreguntasFrecuentes";
import TerminosCondiciones from "./pages/TerminosCondiciones";
import { CarritoProvider } from "./contexts/CarritoContext";

// Protege rutas solo para admin
function RequireAdmin({ children }) {
  const [isSuperuser, setIsSuperuser] = React.useState(false);
  React.useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return setIsSuperuser(false);
      const payload = JSON.parse(atob(token.split(".")[1]));
      setIsSuperuser(!!(payload.is_superuser || payload.is_staff));
    } catch {
      setIsSuperuser(false);
    }
  }, []);
  if (!isSuperuser) return <div className="text-red-400 text-center py-12">Acceso solo para administradores</div>;
  return children;
}

export default function App() {
  return (
    <CarritoProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-black">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/productos/:id" element={<DetalleProducto />} />
              <Route path="/categorias" element={<Categorias />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/ordenes" element={<Ordenes />} />
              <Route path="/acerca" element={<Acerca />} />
              <Route path="/privacidad" element={<PoliticaPrivacidad />} />
              <Route path="/faq" element={<PreguntasFrecuentes />} />
              <Route path="/terminos" element={<TerminosCondiciones />} />
              <Route path="/admin/productos" element={<RequireAdmin><AdminProductos /></RequireAdmin>} />
              <Route path="/admin/productos/nuevo" element={<RequireAdmin><AdminProductoForm modo="crear" /></RequireAdmin>} />
              <Route path="/admin/productos/editar/:id" element={<RequireAdmin><AdminProductoForm modo="editar" /></RequireAdmin>} />
              <Route path="/admin/productos/eliminar/:id" element={<RequireAdmin><AdminProductoEliminar /></RequireAdmin>} />
              <Route path="/admin/categorias" element={<RequireAdmin><AdminCategorias /></RequireAdmin>} />
              <Route path="/admin/imagenes" element={<RequireAdmin><AdminImagenes /></RequireAdmin>} />
              <Route path="/admin/usuarios" element={<RequireAdmin><AdminUsuarios /></RequireAdmin>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CarritoProvider>
  );
}
