import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [siswa, setSiswa] = useState([]);
  const [form, setForm] = useState({
    nis: "", nama: "", alamat: "", jurusan: "", tgl_lahir: ""
  });
  const [editId, setEditId] = useState(null);

  const API_URL = "http://localhost:5003/siswa";

  useEffect(() => {
    fetchSiswa();
  }, []);

  const fetchSiswa = async () => {
    try {
      const res = await axios.get(API_URL);
      setSiswa(res.data);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, form);
        alert("Data diperbarui!");
      } else {
        await axios.post(API_URL, form);
        alert("Data disimpan!");
      }
      resetForm();
      fetchSiswa();
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Cek NIS apakah sudah ada?"));
    }
  };

  const resetForm = () => {
    setEditId(null);
    setForm({ nis: "", nama: "", alamat: "", jurusan: "", tgl_lahir: "" });
  };

  const handleEdit = (data) => {
    setEditId(data.id);
    setForm({
      nis: data.nis || "",
      nama: data.nama || "",
      alamat: data.alamat || "",
      jurusan: data.jurusan || "",
      tgl_lahir: data.tgl_lahir ? data.tgl_lahir.split("T")[0] : "",
    });
  };

  const hapusSiswa = async (id) => {
    if (window.confirm("Yakin ingin menghapus data ini?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchSiswa();
      } catch (err) {
        console.error("Gagal menghapus:", err);
      }
    }
  };

  return (
    <div className="container">
      <h1>Sistem Data Siswa</h1>

      <div className="form-container">
        <h3>{editId ? "✍️ Mode Edit" : "➕ Tambah Siswa"}</h3>
        <form onSubmit={handleSubmit}>
          <input placeholder="NIS" value={form.nis || ""} onChange={e => setForm({...form, nis: e.target.value})} required />
          <input placeholder="Nama" value={form.nama || ""} onChange={e => setForm({...form, nama: e.target.value})} required />
          <input placeholder="Alamat" value={form.alamat || ""} onChange={e => setForm({...form, alamat: e.target.value})} required />
          <div className="date-group">
            <label>Tgl Lahir:</label>
            <input type="date" value={form.tgl_lahir || ""} onChange={e => setForm({...form, tgl_lahir: e.target.value})} required />
          </div>
          <input placeholder="Jurusan" value={form.jurusan || ""} onChange={e => setForm({...form, jurusan: e.target.value})} required />
          
          <div className="form-actions">
            <button type="submit" className={editId ? "btn-update" : "btn-simpan"}>
              {editId ? "Update" : "Simpan"}
            </button>
            {editId && <button type="button" className="btn-batal" onClick={resetForm}>Batal</button>}
          </div>
        </form>
      </div>

      <table>
        <thead>
          <tr>
            <th>NIS</th>
            <th>Nama</th>
            <th>Alamat</th>
            <th>Tgl Lahir</th>
            <th>Jurusan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {siswa.map(s => (
            <tr key={s.id}>
              <td data-label="NIS">{s.nis}</td>
              <td data-label="Nama">{s.nama}</td>
              <td data-label="Alamat">{s.alamat}</td>
              <td data-label="Tgl Lahir">{s.tgl_lahir ? new Date(s.tgl_lahir).toLocaleDateString("id-ID") : "-"}</td>
              <td data-label="Jurusan">{s.jurusan}</td>
              <td data-label="Aksi">
                <div className="action-btns">
                  <button className="btn-edit" onClick={() => handleEdit(s)}>Edit</button>
                  <button className="btn-hapus" onClick={() => hapusSiswa(s.id)}>Hapus</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;