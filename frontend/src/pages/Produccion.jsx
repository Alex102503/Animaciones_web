import { motion } from "framer-motion";
import { Wheat, TrendingUp, Package, BarChart3 } from "lucide-react";

const produccion = [
  {
    cultivo: "Maíz",
    toneladas: 42,
    meta: 50,
  },
  {
    cultivo: "Papa",
    toneladas: 35,
    meta: 40,
  },
  {
    cultivo: "Arroz",
    toneladas: 29,
    meta: 35,
  },
  {
    cultivo: "Tomate",
    toneladas: 18,
    meta: 22,
  },
];

export default function Produccion() {
  return (
    <motion.div
      className="page-content"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="page-title">Producción Agrícola</h1>

      <div className="dashboard-grid">
        <div className="content-card">
          <Wheat size={34} />
          <h2>124 Tn</h2>
          <p>Producción Total</p>
        </div>

        <div className="content-card">
          <TrendingUp size={34} />
          <h2>+18%</h2>
          <p>Crecimiento</p>
        </div>

        <div className="content-card">
          <Package size={34} />
          <h2>36</h2>
          <p>Lotes Cosechados</p>
        </div>

        <div className="content-card">
          <BarChart3 size={34} />
          <h2>92%</h2>
          <p>Cumplimiento</p>
        </div>
      </div>

      <div className="content-card">
        <h2>Producción por Cultivo</h2>

        <div className="table-container">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Cultivo</th>

                <th>Producción</th>

                <th>Meta</th>

                <th>Avance</th>
              </tr>
            </thead>

            <tbody>
              {produccion.map((item) => {
                const porcentaje = Math.round(
                  (item.toneladas / item.meta) * 100,
                );

                return (
                  <tr key={item.cultivo}>
                    <td>{item.cultivo}</td>

                    <td>{item.toneladas} Tn</td>

                    <td>{item.meta} Tn</td>

                    <td>
                      <div
                        style={{
                          width: "100%",
                          background: "#e5e7eb",
                          borderRadius: 10,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${porcentaje}%`,
                            background: "#22c55e",
                            color: "white",
                            textAlign: "center",
                            padding: "4px",
                            fontSize: ".8rem",
                          }}
                        >
                          {porcentaje}%
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
