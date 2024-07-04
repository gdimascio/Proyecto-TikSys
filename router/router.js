
const express = require ("express");
const router = express.Router();
const controller = require("../controllers/controller");
const controllerMail = require("../controllers/controllerMail");

router.get("/", controller.formulario);         // ventana ppl del formulario

router.post("/cargar", controller.submitTkt);   // carga de nuevo tkt a la base de datos

router.get("/enviar", controllerMail.sendMail); // envio de datos del nuevo tkt a mails

router.get("/tkt/:id", controller.showTkt);     // ventana de ticket especifico

module.exports = router;