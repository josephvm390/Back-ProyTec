const express = require("express");
const router = express.Router();
const citaController = require("../controllers/citaController.js");

router.post("/crearCita", citaController.crearCita);
router.get("/obtenercitas", citaController.obtenercitas);
router.get("/obtenerCitaxCorreo/:email", citaController.obtenerCitaxCorreo)
router.put('/editarCita/:id', citaController.editarCita);

module.exports = router;