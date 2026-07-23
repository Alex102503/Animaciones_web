import axios from 'axios';

// Instancia configurada para el Backend
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Ejemplo de funciones de servicio (CRUD) que mostrarían tu dominio de Clean Code
export const obtenerCultivos = async () => {
  try {
    const response = await apiClient.get('/cultivos');
    return response.data;
  } catch (error) {
    console.error("Error al obtener cultivos:", error);
    throw error;
  }
};

export const guardarReporte = async (datos) => {
  try {
    const response = await apiClient.post('/reportes', datos);
    return response.data;
  } catch (error) {
    console.error("Error al guardar el reporte:", error);
    throw error;
  }
};