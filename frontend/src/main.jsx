import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext";
import "./App.css"; // <--- ¡Asegúrate de que esta línea exista!

import './styles/animations.css';
import './styles/cards.css';
import './styles/dashboard.css';
import './styles/header.css';
import './styles/responsive.css';
import './styles/sidebar.css';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);