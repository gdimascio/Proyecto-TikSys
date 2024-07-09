
const express = require ("express");
const router = express.Router();
const controller = require("../controllers/controllerAdmin");
const controllerMail = require("../controllers/controllerAdminMail");


router.get("/", controller.admin);          // ventana de tickets para ADMIN
router.get("/tkt/:id", controller.showTkt); // ventana de tickets especifico para ADMIN

router.post("/estado", controller.estadoTkt);   // cambia el estado del ticket y redirecciona a sendChanges

router.get("/enviar/:tktDoc", controllerMail.sendChanges);  // envia un mail con el estado actualizado del ticket

module.exports = router;
