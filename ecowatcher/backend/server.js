// backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const db = require('./firebaseConfigAdmin'); // Menggunakan firebase-admin

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint untuk root
app.get('/', (req, res) => {
  res.send('Server is running!'); // Pesan untuk menunjukkan bahwa server berjalan
});

// Endpoint untuk mendaftar pengguna
app.post('/api/register', async (req, res) => {
  const { email, password, nama, jenisBank, namaRekening, noRekening } = req.body;

  console.log('Received POST request at /api/register');
  console.log('Request body:', req.body);

  try {
    // Mendaftar pengguna dengan Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    // Menyimpan data pengguna ke Firestore
    await db.collection('users').doc(userRecord.uid).set({
      email,
      nama,
      jenisBank,
      namaRekening,
      noRekening,
      level: 'penyumbang',
      point: 0,
      totalpointmasuk: 0,
      totalpointkeluar: 0,
      foto: 'default.jpg',
    });

    // Respons berhasil
    return res.status(201).send('User registered successfully');
  } catch (error) {
    console.error('Error registering user:', error);

    // Respons error
    return res.status(500).send('Error registering user');
  }
});

// Mulai server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});