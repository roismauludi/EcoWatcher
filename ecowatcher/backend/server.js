const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const { initializeApp } = require('firebase/app'); // Import modular Firebase
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth'); // Import metode auth
const { getFirestore, doc, setDoc, collection, getDocs, query, where, addDoc } = require('firebase/firestore');
const { v4: uuidv4 } = require('uuid'); // Import UUID
const multer = require("multer"); // Untuk menangani unggahan file
const moment = require("moment");
const path = require("path");
const fs = require("fs");

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
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, "uploads", "photos");
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  
  const upload = multer({ storage });
// Inisialisasi Firebase
const appFirebase = initializeApp(firebaseConfig);

// Inisialisasi Firebase Authentication dan Firestore
const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json()); // Pastikan body-parser digunakan untuk parsing JSON
app.use(express.urlencoded({ extended: true }));
app.use('/uploads/photos', express.static(path.join(__dirname, 'uploads', 'photos')));
// Endpoint untuk root
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Endpoint untuk mendaftar pengguna
app.post('/api/register', [
    body('email').isEmail().withMessage('Email is invalid'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('nama').notEmpty().withMessage('Nama is required'),
    body('jenisBank').notEmpty().withMessage('Jenis Bank is required'),
    body('namaRekening').notEmpty().withMessage('Nama Rekening is required'),
    body('noRekening').notEmpty().withMessage('No Rekening is required'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, nama, jenisBank, namaRekening, noRekening } = req.body;

    try {
        // Periksa apakah email sudah digunakan
        const existingUser = await getDocs(query(collection(db, 'users'), where('email', '==', email)));
        if (!existingUser.empty) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Buat pengguna di Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Simpan data pengguna di Firestore
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

        // Respons sukses
        return res.status(201).json({ message: 'User registered successfully', userId: userCredential.user.uid });
    } catch (error) {
        console.error('Error registering user:', error.message);
        return res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
    }
});


// Get catalog data
app.get('/api/catalog', async (req, res) => {
    console.log('Received GET request at /api/catalog');

    try {
        const catalogRef = collection(db, 'katalog');
        const snapshot = await getDocs(catalogRef);

        console.log('Catalog snapshot size:', snapshot.size);

        const data = snapshot.docs.flatMap((doc) => {
            const docData = doc.data();
            console.log(`Processing document: ${doc.id}`);

            const flattenedData = [];
            Object.keys(docData).forEach((category) => {
                console.log(`Processing category: ${category}`);

                if (Array.isArray(docData[category])) {
                    docData[category].forEach((item) => {
                        console.log(`Processing item: ${item.Nama_barang}`);
                        flattenedData.push({
                            id: item.Id_barang || "",
                            name: item.Nama_barang || "",
                            category,
                            points: item.Point || 0,
                            unit: category === "Elektronik" ? "unit" : "kg",
                            image: item.Image || "default",
                            description: item.Deskripsi || "No description available",
                        });
                    });
                }
            });

            return flattenedData;
        });

        console.log('Final catalog data:', JSON.stringify(data, null, 2));
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching catalog data:', error);
        res.status(500).send('Error fetching catalog data');
    }
});

// Endpoint untuk menambahkan barang ke dalam tong
app.post("/api/add-to-tong", async (req, res) => {
    // Log received data
    console.log("Received data:", req.body);  // Log the entire request body
    console.log("Name:", req.body.name);      // Log 'name' value to ensure it's correctly passed
    console.log("Points:", req.body.points);  // Log points to ensure it's being passed

    // Destructure the data from the request body
    const { userId, itemId, name, description, image, points, type } = req.body;

    // Validate required fields
    if (!name || !description || !image || points === undefined || !type) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    // Process the timestamp
    const timestamp = new Date().toISOString();

    try {
        // Save the item to Firestore with points
        const docRef = await addDoc(collection(db, "tong"), {
            userId,
            itemId,
            name,
            description,
            image,
            points, // Save points here
            type,
            timestamp,
        });

        // Log the item that was added
        console.log("Item added to tong:", {
            userId,
            itemId,
            name,
            description,
            image,
            points,  // Log points to ensure it was saved correctly
            type,
            timestamp,
        });

        // Send success response back to the frontend
        res.status(200).json({ message: "Item added successfully" });
    } catch (error) {
        console.error("Error adding item to tong:", error);
        res.status(500).json({ message: "Error adding item to tong" });
    }
});

  // Endpoint GET untuk mengambil data dari koleksi "tong" berdasarkan userId
  app.get('/api/get-items/:userId', async (req, res) => {
    const { userId } = req.params; // Mengambil userId dari parameter URL
  
    try {
        // Query Firestore untuk mengambil data berdasarkan userId
        const snapshot = await getDocs(query(collection(db, 'tong'), where('userId', '==', userId)));
  
        // Mengecek apakah data ada
        if (snapshot.empty) {
            return res.status(404).json({ message: 'No items found' });
        }
  
        // Menyusun data menjadi array dari dokumen Firestore
        const items = snapshot.docs.map(doc => doc.data());
        res.json(items); // Mengirimkan data item ke frontend
  
    } catch (error) {
        console.error('Error retrieving tong items:', error);
        res.status(500).json({ message: 'Error retrieving tong items' });
    }
});

// Endpoint untuk menambah alamat
app.post('/api/add-address', async (req, res) => {
    const { userId, nama, noTlp, labelAlamat, kotaKabupaten, kecamatan, kodePos, detailAlamat } = req.body;

    console.log('Received POST request at /api/add-address');
    console.log('Request body:', req.body);
    console.log('Received userId:', userId);

    try {
        // Pastikan data alamat sesuai dengan struktur yang diinginkan
        const addressData = {
            Nama: nama,
            No_tlp: noTlp,
            label_Alamat: labelAlamat,
            "kota-kabupaten": kotaKabupaten,
            Kecamatan: kecamatan,
            Kode_pos: kodePos,
            Detail_Alamat: detailAlamat,
            userId,
        };

        // Menambahkan alamat baru ke Firestore
        const addressRef = await addDoc(collection(db, "Alamat"), addressData);

        console.log('Address added with ID:', addressRef.id);

        // Respons berhasil
        return res.status(201).send('Address added successfully');
    } catch (error) {
        console.error('Error adding address:', error);
        return res.status(500).send('Error adding address');
    }
});

// Endpoint untuk mengambil alamat pengguna berdasarkan userId
app.get('/api/get-addresses/:userId', async (req, res) => {
    const { userId } = req.params;
    console.log('Received GET request for userId:', userId);

    try {
        const querySnapshot = await getDocs(collection(db, "Alamat"));
        const addresses = [];
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.userId === userId) {
                addresses.push({ id: doc.id, ...data });
            }
        });

        if (addresses.length > 0) {
            return res.status(200).json(addresses);
        } else {
            return res.status(404).send('No addresses found');
        }
    } catch (error) {
        console.error('Error fetching addresses:', error);
        return res.status(500).send('Error fetching addresses');
    }
});

app.post('/api/submit-pickup', upload.array('photos'), async (req, res) => {
    try {
        // Menyimpan data dari form
        const { userId, address, items, pickUpDate } = req.body;

        // Parsing JSON yang diterima sebagai string
        const parsedAddress = JSON.parse(address); // Mengubah string menjadi objek
        const parsedItems = JSON.parse(items); // Mengubah string menjadi objek

        // Validasi jika data wajib tidak ada
        if (!userId || !parsedAddress || !parsedItems || !pickUpDate || !req.files.length) {
            return res.status(400).json({ message: "Semua data wajib diisi." });
        }

        console.log('Tanggal yang diterima:', pickUpDate);
        const formattedPickUpDate = moment(pickUpDate, 'dddd, DD MMMM YYYY', 'id', true);
        console.log('Tanggal setelah format:', formattedPickUpDate.format());


        if (!formattedPickUpDate.isValid()) {
            return res.status(400).json({ message: 'Tanggal pickup tidak valid. Format yang benar adalah Hari-Bulan-Tahun (Contoh: Kamis, 13 Desember 2024).' });
        }

        // Konversi ke ISO format jika valid
        const isoFormattedPickUpDate = formattedPickUpDate.toISOString();

        // Menyusun URL untuk foto yang diupload
        const photoUrls = req.files.map(file => {
            return path.join('uploads/photos', file.filename); // Atau Anda dapat menyimpan URL yang dapat diakses secara publik
        });

        // Ambil antrean terakhir
        const snapshot = await getDocs(collection(db, "Penyetoran"));
        let lastQueueNumber = 0;

        if (!snapshot.empty) {
            snapshot.forEach(doc => {
                const data = doc.data();
                if (data.queueNumber) {
                    // Ambil nomor antrean terbesar
                    const currentNumber = parseInt(data.queueNumber.split('-')[1], 10);
                    if (currentNumber > lastQueueNumber) {
                        lastQueueNumber = currentNumber;
                    }
                }
            });
        }

        // Generate nomor antrean baru
        const newQueueNumber = `ANTRIAN-${String(lastQueueNumber + 1).padStart(3, '0')}`;

        // Simpan data pickup ke Firestore
        const pickupData = {
            userId,
            queueNumber: newQueueNumber, // Nomor antrean baru
            address: parsedAddress, // Pastikan alamat sudah berupa objek
            items: parsedItems,
            photos: photoUrls,
            pickUpDate: isoFormattedPickUpDate, // Gunakan formattedPickUpDate dalam ISO
            status: "Pending",
            createdAt: new Date().toISOString(),
        };

        // Simpan `pickupData` ke Firestore
        await addDoc(collection(db, "Penyetoran"), pickupData);

        // Menampilkan informasi foto yang diupload
        console.log("Uploaded files:", req.files);

        // Kirim respon sukses
        res.status(200).json({ message: "Data berhasil diterima", queueNumber: newQueueNumber, photos: req.files });
    } catch (error) {
        console.error('Error processing data:', error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
});

app.get('/api/get-pickups', async (req, res) => {
    try {
        // Ambil parameter query (opsional)
        const { userId, queueNumber, status } = req.query;

        // Query ke Firestore
        const collectionRef = collection(db, "Penyetoran");
        let querySnapshot;

        // Jika ada filter berdasarkan parameter
        if (userId || queueNumber || status) {
            let queryConstraints = [];
            if (userId) queryConstraints.push(where('userId', '==', userId));
            if (queueNumber) queryConstraints.push(where('queueNumber', '==', queueNumber));
            if (status) queryConstraints.push(where('status', '==', status));

            const filteredQuery = query(collectionRef, ...queryConstraints);
            querySnapshot = await getDocs(filteredQuery);
        } else {
            // Jika tidak ada filter, ambil semua data
            querySnapshot = await getDocs(collectionRef);
        }

        // Jika tidak ada data
        if (querySnapshot.empty) {
            return res.status(404).json({ message: "Tidak ada data yang ditemukan." });
        }

        // Format hasil query menjadi array
        const pickups = [];
        querySnapshot.forEach(doc => {
            pickups.push({
                id: doc.id,
                ...doc.data(),
            });
        });

        // Kirim respon sukses
        res.status(200).json({ message: "Data berhasil diambil", data: pickups });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
});


// Mulai server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
