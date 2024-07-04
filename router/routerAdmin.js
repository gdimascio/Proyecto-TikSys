
const express = require ("express");
const router = express.Router();
const controller = require("../controllers/controllerAdmin");


router.get("/", controller.admin);          // ventana de tickets para ADMIN
router.get("/tkt/:id", controller.showTkt); // ventana de tickets especifico para ADMIN


module.exports = router;
