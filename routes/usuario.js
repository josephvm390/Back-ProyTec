const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController.js");

router.post("/crearUsuario", usuarioController.createUsuario);
router.post("/loginUsuario", usuarioController.loginUsuario);


module.exports = router;