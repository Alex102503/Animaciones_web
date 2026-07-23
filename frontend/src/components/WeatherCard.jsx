import { motion } from "framer-motion";
import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiHumidity,
  WiStrongWind,
} from "react-icons/wi";

export default function WeatherCard({
  clima = "Soleado",
  temperatura = 26,
  humedad = 72,
  viento = 14,
  calidad = "Excelente",
  actualizacion = "Hace unos segundos",
}) {
  const obtenerIcono = () => {
    switch (clima.toLowerCase()) {
      case "lluvioso":
        return <WiRain size={70} />;
      case "nublado":
        return <WiCloud size={70} />;
      default:
        return <WiDaySunny size={70} />;
    }
  };

  return (
    <motion.div
      className="content-card weather-card"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="weather-header">
        <h3>Clima Actual</h3>
        {obtenerIcono()}
      </div>

      <div className="weather-temp">
        <h1>{temperatura}°C</h1>
        <p>{clima}</p>
      </div>

      <div className="weather-info">
        <div className="weather-item">
          <WiHumidity size={28} />
          <div>
            <span>Humedad</span>
            <strong>{humedad}%</strong>
          </div>
        </div>

        <div className="weather-item">
          <WiStrongWind size={28} />
          <div>
            <span>Viento</span>
            <strong>{viento} km/h</strong>
          </div>
        </div>

        <div className="weather-item">
          <span style={{ fontSize: "22px" }}>🌱</span>
          <div>
            <span>Calidad</span>
            <strong>{calidad}</strong>
          </div>
        </div>
      </div>

      <small className="weather-update">Actualizado: {actualizacion}</small>
    </motion.div>
  );
}
