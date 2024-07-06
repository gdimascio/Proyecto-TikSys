
const express = require ("express");
const router = express.Router();
const controllerMail = require("../controllers/controllerMail");

router.get("/", controllerMail.sendMail); // envio de datos del nuevo tkt a mails

module.exports = router;