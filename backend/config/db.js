const admin = require('firebase-admin');
require('dotenv').config();

let db;

try {
  if (!admin.apps.length) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } else {
      console.warn("WARNING: FIREBASE_SERVICE_ACCOUNT_KEY not found in .env.");
      admin.initializeApp();
    }
  }
  db = admin.firestore();
  console.log(`Firebase Initialized Successfully.`);
} catch (error) {
  console.error(`Firebase Connection Error: ${error.message}`);
}

const connectDB = async () => {
  // Empty function to keep compatibility with server.js
  console.log('Firebase is already connected.');
};

module.exports = { connectDB, db };
