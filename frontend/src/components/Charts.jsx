import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

// Registrar los elementos de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function LineChart({ historialHumedad, historialTemperatura }) {
  const data = {
    labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Hoy'],
    datasets: [
      {
        label: 'Humedad (%)',
        data: historialHumedad || [65, 59, 80, 81, 56, 55, 72],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Temperatura (°C)',
        data: historialTemperatura || [22, 24, 27, 23, 26, 28, 25],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        fill: true,
        tension: 0.4,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: false }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  return <Line data={data} options={options} />;
}

export function WaterDoughnutChart({ lluvia, riegoManual }) {
  const data = {
    labels: ['Lluvia Natural', 'Riego Manual'],
    datasets: [
      {
        data: [lluvia || 70, riegoManual || 30],
        backgroundColor: ['#52b788', '#3b82f6'],
        borderColor: ['#ffffff', '#ffffff'],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  return <Doughnut data={data} options={options} />;
}