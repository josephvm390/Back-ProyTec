const express = require("express");
const router = express.Router();
const citaController = require("../controllers/citaController.js");

router.post("/crearCita", citaController.crearCita);
router.get("/obtenercitas", citaController.obtenercitas);

module.exports = router;