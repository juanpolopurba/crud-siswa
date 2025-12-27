const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '0511119899Bb,.', // Pastikan password ini benar
    database: 'db_siswa'
});

// Create
app.post('/siswa', (req, res) => {
    const { nis, nama, alamat, tgl_lahir, jurusan } = req.body;
    db.query(
        'INSERT INTO siswa (nis, nama, alamat, tgl_lahir, jurusan) VALUES (?, ?, ?, ?, ?)', 
        [nis, nama, alamat, tgl_lahir, jurusan], 
        (err) => {
            if (err) return res.status(500).send(err);
            res.send("Data Berhasil Disimpan");
        }
    );
});

// Read
app.get('/siswa', (req, res) => {
    db.query('SELECT * FROM siswa', (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

// Delete
app.delete('/siswa/:id', (req, res) => {
    db.query('DELETE FROM siswa WHERE nis = ?', [req.params.nis], (err) => {
        if (err) return res.status(500).send(err);
        res.send("Data Terhapus");
    });
});

// Update Data Siswa (BAGIAN YANG DIPERBAIKI)
app.put('/siswa/:id', (req, res) => {
    const { nis } = req.params;
    const { nama, alamat, tgl_lahir, jurusan } = req.body; // Ambil semua data
    
    // Query diperbaiki (hapus koma sebelum WHERE dan sesuaikan urutan ?)
    const sql = 'UPDATE siswa SET nama = ?, alamat = ?, tgl_lahir = ?, jurusan = ? WHERE nis = ?';
    
    db.query(sql, [nis, nama, alamat, tgl_lahir, jurusan,], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.send("Data Berhasil Diperbarui");
    });
});

app.listen(5003, () => console.log('Server running on port 5003'));