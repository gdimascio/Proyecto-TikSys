require("dotenv").config();

const admin = require ("firebase-admin");

/*
// const serviceAccountSecret = require(process.env.fbTOKEN);
const serviceAccountLocal = require("../systick-firebase-token.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountLocal)
});
*/

try {
    const serviceAccountSecret = require(process.env.fbTOKEN);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccountSecret)
    });
} catch (error) {
    console.log("Error al acceder con TOKEN de SECRETS");
    console.log("Accediendo con TOKEN local");
    const serviceAccountLocal = require("../systick-firebase-token.json");

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccountLocal)
    });
}

const db = admin.firestore();

module.exports = db;