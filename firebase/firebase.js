require("dotenv").config();

const admin = require ("firebase-admin");

try {
    const serviceAccountSecret = JSON.parse(process.env.fbTOKEN);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccountSecret)
    });
} catch (error) {
    console.log("ERROR AL ACCEDER AL TOKEN de .env");
    const serviceAccountLocal = require("../systick-firebase-token.json");
    console.log("Accediendo con TOKEN local");

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccountLocal)
    });
}

const db = admin.firestore();

module.exports = db;