import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import Configuracion from "./pages/Configuracion";
import Cultivos from "./pages/Cultivos";
import Clima from "./pages/Clima"; // Importado
import Historial from "./pages/Historial"; // Importado
import Parcelas from "./pages/Parcelas";
import Plagas from "./pages/Plagas";
import Produccion from "./pages/Produccion";
import Riego from "./pages/Riego";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app-layout">
      <Sidebar isOpen={isSidebarOpen} />

      <div
        className={`main-wrapper ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
      >
        <Header toggleSidebar={toggleSidebar} />

        <main
          className="main-content"
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/cultivos" element={<Cultivos />} />
            <Route path="/parcelas" element={<Parcelas />} />
            <Route path="/plagas" element={<Plagas />} />
            <Route path="/produccion" element={<Produccion />} />
            <Route path="/riego" element={<Riego />} />
            <Route path="/clima" element={<Clima />} />{" "}
            <Route path="/historial" element={<Historial />} />{" "}
            <Route path="/configuracion" element={<Configuracion />} />
          </Routes>
          <Footer />
        </main>
      </div>
    </div>
  );
}
