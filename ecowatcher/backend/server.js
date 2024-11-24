const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initializeApp } = require('firebase/app'); // Import modular Firebase
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth'); // Import metode auth
const { getFirestore, doc, setDoc } = require('firebase/firestore'); // Import metode Firestore

// Middleware
const app = express();
const PORT = process.env.PORT || 5000;

const firebaseConfig = {
    apiKey: "AIzaSyBGoLFNgxifM3TSBGKZllmDEFGPvWQJI2A",
    authDomain: "ecowatcher-f5470.firebaseapp.com",
    projectId: "ecowatcher-f5470",
    storageBucket: "ecowatcher-f5470.firebasestorage.app",
    messagingSenderId: "554505764957",
    appId: "1:554505764957:web:f5ce326d903e01d2038db4"
};

// Inisialisasi Firebase
const appFirebase = initializeApp(firebaseConfig);

// Inisialisasi Firebase Authentication dan Firestore
const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Pastikan body-parser digunakan untuk parsing JSON

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
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Menyimpan data pengguna ke Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
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
    console.log(`Server is running on http://localhost:${PORT}`); // Perbaiki sintaks untuk console.log
});
