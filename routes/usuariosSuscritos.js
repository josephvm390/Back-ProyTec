const express = require("express");
const router = express.Router();
const usuariosSuscritosController = require("../controllers/usuariosSuscritosController.js");

router.post("/crearUsuscritos", usuariosSuscritosController.crearUsuscritos);

module.exports = router;