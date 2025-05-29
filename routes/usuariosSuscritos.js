const express = require("express");
const router = express.Router();
const usuariosSuscritosController = require("../controllers/usuariosSuscritosController.js");

router.post("/crearUsuscritos", usuariosSuscritosController.crearUsuscritos);
router.get("/InfoUsu/:dni", usuariosSuscritosController.InfoUsu);

module.exports = router;