const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) console.error("Database koneksi gagal: " + err.stack);
    else console.log("Terhubung ke database MySQL");
});

// GET: Ambil semua data
app.get('/siswa', (req, res) => {
    db.query('SELECT * FROM siswa ORDER BY id DESC', (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

// POST: Tambah data baru
app.post('/siswa', (req, res) => {
    const { nis, nama, alamat, tgl_lahir, jurusan } = req.body;
    const sql = 'INSERT INTO siswa (nis, nama, alamat, tgl_lahir, jurusan) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [nis, nama, alamat, tgl_lahir, jurusan], (err) => {
        if (err) return res.status(500).send(err);
        res.send("Data Berhasil Disimpan");
    });
});

// PUT: Update data berdasarkan ID
app.put('/siswa/:id', (req, res) => {
    const { id } = req.params;
    const { nis, nama, alamat, tgl_lahir, jurusan } = req.body;
    const sql = 'UPDATE siswa SET nis=?, nama=?, alamat=?, tgl_lahir=?, jurusan=? WHERE id=?';
    db.query(sql, [nis, nama, alamat, tgl_lahir, jurusan, id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.send("Data Berhasil Diperbarui");
    });
});

// DELETE: Hapus data berdasarkan ID
app.delete('/siswa/:id', (req, res) => {
    db.query('DELETE FROM siswa WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send("Data Terhapus");
    });
});

app.listen(5003, () => console.log('Server running on http://localhost:5003'));