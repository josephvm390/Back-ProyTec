const express = require("express");
const router = express.Router();
const doctoresController = require("../controllers/doctoresController.js")
const multer = require("multer");
const path = require("path");

// Configuración de almacenamiento para las imagenes a utilizar
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // carpeta que se crea en la raiz donde se guardara las imagenes
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.post("/crearDoctor", upload.single("imagen"), doctoresController.crearDoctor);
router.post("/loginDoctor", doctoresController.loginDoctor);

module.exports = router;