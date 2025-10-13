export default function Upload() {
  const API = "http://localhost:8000";
  const onChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${API}/upload`, { method: "POST", body: form });
    alert((await res.json()).message || "Listo");
  };
  return (
    <div style={{margin:"20px 0"}}>
      <label>Subir nuevo Excel: </label>
      <input type="file" accept=".xlsx" onChange={onChange} />
    </div>
  );
}
