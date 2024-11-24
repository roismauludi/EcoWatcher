// backend/firebaseConfigAdmin.js
const admin = require('firebase-admin');

// Ganti dengan path ke file kunci layanan Anda
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://ecowatcher-f5470.firebaseio.com' // Ganti dengan URL database Anda
});

const db = admin.firestore();

module.exports = db;