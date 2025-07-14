const express = require("express");
const router = express.Router();
const citaController = require("../controllers/citaController.js");

router.post("/crearCita", citaController.crearCita);
router.get("/obtenercitas", citaController.obtenercitas);
router.get("/obtenerCitaxCorreo/:email", citaController.obtenerCitaxCorreo)
router.put('/actulizarCita/:id', citaController.actulizarCita);
router.put('/cancelarCita/:id', citaController.cancelarCitaPaciente);
router.get("/obtenerCitaxCorreoDoc/:correo", citaController.obtenerCitaxCorreoDoc)
router.post("/solicitudReprogramacion/:id", citaController.solicitudReprogramacion)

module.exports = router;