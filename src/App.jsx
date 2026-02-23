import { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import Upload from "./Upload";

function Bar({ rows, xKey, yKey, title }) {
  const id = Math.random().toString(36).slice(2);
  useEffect(() => {
    const ctx = document.getElementById(id);
    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: rows.map(r => r[xKey]),
datasets: [{
  data: rows.map(r => r[yKey]),
  backgroundColor: "rgba(147,197,253,0.85)", // azul claro
  borderColor: "rgba(147,197,253,1)",
  borderWidth: 1
}]      },
      options: { responsive: true, plugins: { legend: { display: false }, title: { display: true, text: title } } }
    });
    return () => chart.destroy();
  }, [rows, xKey, yKey, title]);
  return <canvas id={id} />;
}

export default function App() {
  const [data, setData] = useState(null);
  const API = "http://localhost:8000";

  useEffect(() => {
    fetch(`${API}/summary`).then(r => r.json()).then(setData).catch(console.error);
  }, []);

  if (!data) return <div style={{padding:20}}>Cargando…</div>;

  const f = data.frecuencias;

  return (
    <div style={{maxWidth: 1000, margin: "0 auto", padding: 20}}>
      <h1>Análisis comparativo de resultados</h1>
      <p>Total respuestas: <b>{data.total_respuestas}</b></p>

      <section>
        <h2>Relevancia de la lectura crítica</h2>
        <Bar rows={f.relevancia_lectura} xKey="categoria" yKey="conteo" title="Relevancia (conteo)" />
        <Tabla rows={f.relevancia_lectura} />
      </section>

      <section>
        <h2>Utilidad de Saber Pro</h2>
        <Bar rows={f.utilidad_saber_pro} xKey="categoria" yKey="conteo" title="Utilidad (conteo)" />
        <Tabla rows={f.utilidad_saber_pro} />
      </section>

      <section>
        <h2>Interés en modelo ML</h2>
        <Bar rows={f.interes_modelo_ml} xKey="categoria" yKey="conteo" title="Interés (conteo)" />
        <Tabla rows={f.interes_modelo_ml} />
      </section>
    </div>
  );
}

function Tabla({ rows }) {
  return (
    <table style={{width:"100%", borderCollapse:"collapse", marginTop:10}}>
      <thead>
        <tr>
          <th style={th}>Categoría</th>
          <th style={th}>Conteo</th>
          <th style={th}>%</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            <td style={td}>{r.categoria}</td>
            <td style={{...td, textAlign:"center"}}>{r.conteo}</td>
            <td style={{...td, textAlign:"center"}}>{r.porcentaje}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const th = { border:"1px solid #ddd", padding:8, background:"#f5f5f5", textAlign:"left" };
const td = { border:"1px solid #ddd", padding:8 };
