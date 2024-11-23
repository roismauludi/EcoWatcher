import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBGoLFNgxifM3TSBGKZllmDEFGPvWQJI2A",
  authDomain: "ecowatcher-f5470.firebaseapp.com",
  projectId: "ecowatcher-f5470",
  storageBucket: "ecowatcher-f5470.firebasestorage.app",
  messagingSenderId: "554505764957",
  appId: "1:554505764957:web:f5ce326d903e01d2038db4",
};

// Inisialisasi aplikasi Firebase
const app = initializeApp(firebaseConfig);

// Inisialisasi Firestore
const db = getFirestore(app);

// Inisialisasi Firebase Authentication
const auth = getAuth(app);

export { db, auth };
