const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController.js");

router.post("/crearUsuario", usuarioController.createUsuario);
router.post("/loginUsuario", usuarioController.loginUsuario);
router.get("/listUsuarios", usuarioController.listUsuarios)
router.get("/UserDetails/:email", usuarioController.UserDetails)


module.exports = router;