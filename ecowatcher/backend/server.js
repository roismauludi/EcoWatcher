const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const { initializeApp } = require('firebase/app'); // Import modular Firebase
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth'); // Import metode auth
const { getFirestore, doc, setDoc, collection, getDocs, query, where, addDoc, deleteDoc, updateDoc, increment, getDoc } = require('firebase/firestore');
const { arrayUnion } = require('firebase/firestore');
const { v4: uuidv4 } = require('uuid'); // Import UUID
const multer = require("multer"); // Untuk menangani unggahan file
const moment = require('moment-timezone');
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
    console.log("Received data:", req.body);

    const { userId, itemId, name, description, image, points, type, quantity = 1 } = req.body;

    // Validate required fields
    if (!name || !description || !image || points === undefined || !type) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    if (quantity <= 0 || typeof quantity !== 'number') {
        return res.status(400).json({ error: "Invalid quantity. It must be a positive number." });
    }

    const timestamp = new Date().toISOString();

    try {
        const docRef = await addDoc(collection(db, "tong"), {
            userId,
            itemId,
            name,
            description,
            image,
            points,
            type,
            quantity,
            timestamp,
        });

        console.log("Item added to tong:", {
            userId,
            itemId,
            name,
            description,
            image,
            points,
            type,
            quantity,
            timestamp,
        });

        res.status(200).json({ message: "Item added successfully" });
    } catch (error) {
        console.error("Error adding item to tong:", error.message, error.stack);
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

app.delete('/api/delete-item/:itemId', async (req, res) => {
    const { itemId } = req.params;

    try {
        const querySnapshot = await getDocs(query(
            collection(db, 'tong'),
            where('itemId', '==', itemId)
        ));

        if (querySnapshot.empty) {
            return res.status(200).json({ message: 'No items remaining', items: [] });
        }

        for (const docSnapshot of querySnapshot.docs) {
            const docRef = doc(db, 'tong', docSnapshot.id);
            await deleteDoc(docRef);
        }

        // Ambil kembali daftar item setelah penghapusan
        const remainingItemsSnapshot = await getDocs(collection(db, 'tong'));
        const remainingItems = remainingItemsSnapshot.docs.map(doc => doc.data());

        res.status(200).json({ message: 'Item deleted successfully', items: remainingItems });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ message: 'Error deleting item', error: error.message });
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
            pickUpFee : 500,
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

app.get('/api/get-pickups/:userId', async (req, res) => {
    const { userId } = req.params;  // Mengambil userId dari URL parameter
    console.log('Received GET request for userId:', userId);

    try {
        // Ambil parameter query (opsional), jika ada filter tambahan
        const { queueNumber, status } = req.query;

        // Query ke Firestore untuk koleksi Penyetan berdasarkan userId
        const collectionRef = collection(db, "Penyetoran");
        let querySnapshot;

        // Buat query berdasarkan userId yang ada di URL
        let queryConstraints = [where('userId', '==', userId)];  // Filter berdasarkan userId
        if (queueNumber) queryConstraints.push(where('queueNumber', '==', queueNumber));
        if (status) queryConstraints.push(where('status', '==', status));

        // Lakukan query dengan constraint yang sudah dibuat
        const filteredQuery = query(collectionRef, ...queryConstraints);
        querySnapshot = await getDocs(filteredQuery);

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

app.get('/api/get-pickups', async (req, res) => {
    try {
        // Mengambil query parameter 'queueNumber' dari URL
        const { queueNumber } = req.query;

        console.log('Received GET request with query parameter queueNumber:', queueNumber);

        // Query ke Firestore untuk koleksi Penyetan
        const collectionRef = collection(db, "Penyetoran");
        let querySnapshot;

        // Pastikan 'queueNumber' diterima sebagai parameter
        if (!queueNumber) {
            return res.status(400).json({ message: "Parameter 'queueNumber' wajib disertakan." });
        }

        // Lakukan query berdasarkan queueNumber
        const filteredQuery = query(collectionRef, where('queueNumber', '==', queueNumber));
        querySnapshot = await getDocs(filteredQuery);

        // Jika tidak ada data yang ditemukan
        if (querySnapshot.empty) {
            return res.status(404).json({ message: "Tidak ada data yang ditemukan dengan queueNumber tersebut." });
        }

        // Format hasil query menjadi array
        const pickups = [];
        querySnapshot.forEach(doc => {
            pickups.push({
                id: doc.id,
                ...doc.data(),
            });
        });

        // Kirim respon sukses dengan data
        res.status(200).json({ message: "Data berhasil diambil", data: pickups });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
});

app.put('/api/update-status/:pickupId', async (req, res) => {
    const { pickupId } = req.params;
    
    try {
        // Reference to the document in Firestore
        const pickupRef = doc(db, 'Penyetoran', pickupId);  // Correct Firestore method for referencing document
        
        // Update the status of the pickup
        await updateDoc(pickupRef, {
            status: 'Dibatalkan'
        });

        res.status(200).json({ message: 'Status berhasil diubah menjadi Dibatalkan' });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui status' });
    }
});

app.put('/api/updatestatus/:pickupId', async (req, res) => {
    const { pickupId } = req.params;
    const { newStatus } = req.body;  // Status baru yang diterima dari body request

    console.log('pickupId yang diterima:', pickupId); // Tambahkan log ini

    if (!newStatus) {
        return res.status(400).json({ message: 'Status baru harus diberikan' });
    }

    try {
        // Mengambil referensi dokumen dari koleksi 'Penyetoran'
        const pickupRef = doc(db, 'Penyetoran', pickupId);
        
        // Ambil data dari dokumen 'Penyetoran'
        const docSnapshot = await getDoc(pickupRef);
        console.log('Snapshot dokumen:', docSnapshot.exists(), docSnapshot.data()); // Tambahkan log ini

        if (!docSnapshot.exists()) {
            return res.status(404).json({ message: 'Data pickup tidak ditemukan' });
        }

        const currentStatus = docSnapshot.data()?.status;

        const validStatuses = {
            Pending: ['Dijemput'],
            Dijemput: ['Ditimbang'],
            Ditimbang: ['Selesai'],
        };

        // Cek apakah transisi status valid
        if (!validStatuses[currentStatus]?.includes(newStatus)) {
            return res.status(400).json({
                message: `Transisi status tidak valid dari ${currentStatus} ke ${newStatus}`,
            });
        }

        // Update status di koleksi 'Penyetoran'
        await updateDoc(pickupRef, { status: newStatus });

        // Jika status berubah dari 'Pending' ke 'Dijemput', tambahkan data ke koleksi 'Track'
        if (currentStatus === 'Pending' && newStatus === 'Dijemput') {
            const trackData = {
                pickupId: pickupId,
                queueNumber: docSnapshot.data()?.queueNumber,  // Ambil nomor antrian
                newStatus: newStatus,
                statuses: [],
                timestamp: new Date(),  // Waktu perubahan status
            };

            // Menambahkan data ke koleksi 'Track'
            console.log('Menambahkan data ke koleksi Track:', trackData); // Tambahkan log ini
            const trackRef = collection(db, 'Track');
            await addDoc(trackRef, trackData);
        }

        res.status(200).json({ message: `Status berhasil diubah menjadi ${newStatus}` });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui status' });
    }
});

app.get('/api/track-pickup/:pickupId', async (req, res) => {
    const pickupId = req.params.pickupId;
    console.log(`Menerima permintaan untuk pickupId: ${pickupId}`);

    try {
        const db = getFirestore();
        const penyetoranRef = doc(db, "Penyetoran", pickupId);
        const penyetoranSnapshot = await getDoc(penyetoranRef);

        if (!penyetoranSnapshot.exists()) {
            console.log(`Dokumen Penyetoran dengan ID ${pickupId} tidak ditemukan.`);
            return res.status(404).json({ message: "pickupId dari penyetoran tidak ditemukan." });
        }

        const penyetoranData = penyetoranSnapshot.data();
        console.log("Data dari dokumen Penyetoran:", penyetoranData);

        const queueNumber = penyetoranData.queueNumber; // Pastikan ini diambil dengan benar
        console.log("Queue Number:", queueNumber);

        const trackRef = collection(db, "Track");
        const trackQuery = query(trackRef, where("queueNumber", "==", queueNumber));
        const trackSnapshot = await getDocs(trackQuery);

        if (trackSnapshot.empty) {
            console.log(`Dokumen Track dengan queueNumber ${queueNumber} tidak ditemukan.`);
            return res.status(404).json({ message: "Data penjemputan tidak ditemukan." });
        }

        const trackData = trackSnapshot.docs.map(doc => doc.data())[0];
        console.log("Data dari dokumen Track:", trackData);

        // Format statuses dan timestamp
        const formattedStatuses = trackData.statuses ? trackData.statuses.map(status => {
            return {
                status: status.status || "Tidak diketahui", // Pastikan status ada
                timestamp: status.timestamp ? new Date(status.timestamp.seconds * 1000 + status.timestamp.nanoseconds / 1000000) : null // Konversi timestamp jika ada
            };
        }) : [];

        // Pastikan `queueNumber` dikirimkan dalam respons
        res.json({
            queueNumber: queueNumber,  // Mengirimkan queueNumber
            newStatus: trackData.newStatus,  // Status terbaru
            statuses: formattedStatuses,  // Mengirimkan status dalam array yang terformat
            timestamp: trackData.timestamp ? new Date(trackData.timestamp.seconds * 1000 + trackData.timestamp.nanoseconds / 1000000) : null,  // Mengirimkan timestamp
        });
    } catch (error) {
        console.error("Error fetching tracking data:", error);
        res.status(500).json({ message: "Terjadi kesalahan saat melacak data penjemputan." });
    }
});

app.put('/api/update-track-status', async (req, res) => {
    const { pickupId, newStatus } = req.body;

    // Validasi input
    if (!pickupId || !newStatus) {
        return res.status(400).json({
            success: false,
            message: 'pickupId dan newStatus diperlukan',
        });
    }

    try {
        // Mencari dokumen Track berdasarkan pickupId
        const trackRef = collection(db, 'Track');  // Mengakses koleksi 'Track'
        const snapshot = await getDocs(query(trackRef, where('pickupId', '==', pickupId)));

        if (snapshot.empty) {
            return res.status(404).json({
                success: false,
                message: 'Dokumen tidak ditemukan',
            });
        }

        // Ambil dokumen pertama yang ditemukan
        const docRef = snapshot.docs[0].ref;

        // Membuat objek status baru dengan timestamp
        const statusWithTimestamp = {
            status: newStatus,
            timestamp: new Date(),  // Menyimpan waktu saat status diperbarui
        };

        // Memperbarui dokumen dengan menambahkan status baru ke array 'statuses'
        await updateDoc(docRef, {
            statuses: arrayUnion(statusWithTimestamp),  // Menambahkan status baru ke array
        });

        res.status(200).json({
            success: true,
            message: 'Status berhasil diperbarui',
        });
    } catch (error) {
        console.error('Error updating track status:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal memperbarui status',
        });
    }
});

app.put("/api/update-quantity/:itemId", async (req, res) => {
    const { itemId } = req.params; // itemId diambil dari URL parameter
    const { pickupId, newQuantity } = req.body; // pickupId dan newQuantity diambil dari body request
  
    // Validasi input
    if (!pickupId || !itemId || newQuantity === undefined) {
      return res.status(400).json({
        message: "pickupId, itemId, dan newQuantity harus diberikan",
      });
    }
  
    try {
      const pickupRef = doc(db, "Penyetoran", pickupId); // Referensi ke dokumen Penyetoran
      const docSnapshot = await getDoc(pickupRef);
  
      // Cek apakah dokumen ada
      if (!docSnapshot.exists()) {
        return res.status(404).json({ message: "Data tidak ditemukan" });
      }
  
      const data = docSnapshot.data();
      const updatedItems = data.items.map((item) =>
        item.itemId === itemId ? { ...item, quantity: newQuantity } : item
      );
  
      // Perbarui dokumen di koleksi Penyetoran
      await updateDoc(pickupRef, { items: updatedItems });
  
      return res.status(200).json({
        success: true,
        message: `Quantity berhasil diubah menjadi ${newQuantity}`,
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
      return res.status(500).json({
        message: "Terjadi kesalahan saat memperbarui quantity",
      });
    }
  });
  


app.post("/api/add-points", async (req, res) => {
    const { userId, points } = req.body;
    console.log("Received points:", points, "for user:", userId); // Log the received points
  
    if (!userId || points === undefined) {
      return res.status(400).json({ error: "Missing userId or points" });
    }
  
    try {
      const userDocRef = doc(db, "users", userId);
  
      // Update the user's totalpointmasuk and point
      await updateDoc(userDocRef, {
        totalpointmasuk: increment(points), // Add points to totalpointmasuk
        point: increment(points),           // Add points to point
      });
  
      res.status(200).json({ message: "Points added successfully" });
    } catch (error) {
      console.error("Error adding points to user:", error);
      res.status(500).json({ error: "Failed to add points to user" });
    }
  });
  
  app.get('/getUserData/:userId', async (req, res) => {
    const userId = req.params.userId;
    console.log("Requested userId:", userId); // Log untuk mengecek userId yang diterima
  
    try {
      // Ambil data dari koleksi 'penyetoran' berdasarkan userId dan status 'Selesai' atau 'Dibatalkan'
      const penyetoranQuery = query(
        collection(db, 'Penyetoran'),
        where('userId', '==', userId),
        where('status', 'in', ['Selesai', 'Dibatalkan']) // Menambahkan filter status
      );
      const penyetoranSnapshot = await getDocs(penyetoranQuery);
  
      if (penyetoranSnapshot.empty) {
        return res.status(404).json({ message: 'Tidak Ada Data Riwayat.' });
      }
  
      // Ambil data dari koleksi 'transactions' berdasarkan userId
      const transactionsQuery = query(
        collection(db, 'transactions'),
        where('userId', '==', userId)
      );
      const transactionsSnapshot = await getDocs(transactionsQuery);
  
      // Log untuk mengecek hasil dari query transactions
      console.log("transactionsSnapshot size:", transactionsSnapshot.size);
  
      if (transactionsSnapshot.empty) {
        return res.status(404).json({ message: 'No transactions found for this user.' });
      }
  
      // Format data penyetoran
      const penyetoranData = [];
      penyetoranSnapshot.forEach(doc => {
        penyetoranData.push({ id: doc.id, ...doc.data() });
      });
  
      // Format data transaksi
      const transactionsData = [];
      transactionsSnapshot.forEach(doc => {
        transactionsData.push({ id: doc.id, ...doc.data() });
      });
  
      // Kirim data kombinasi
      res.status(200).json({
        userId,
        penyetoran: penyetoranData,
        transactions: transactionsData,
      });
    } catch (error) {
      console.error("Error fetching data: ", error);
      res.status(500).json({ message: "Internal server error", error });
    }
  });  

// Mulai server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
