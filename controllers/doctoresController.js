const Doctores = require("../models/Doctores");
const config = require("../config/global");

exports.crearDoctor = async (req, res) => {
    try {
        const { nombre, celular, correo } = req.body;

        // Validar que se subió una imagen
        if (!req.file) {
            return res.status(400).json({ message: "Imagen requerida" });
        }

        const nuevoDoctor = new Doctores({
            nombre,
            celular,
            correo,
            imagenPath: req.file.path // ruta donde multer guardó la imagen
        });

        await nuevoDoctor.save();
        res.status(201).json({ message: "Doctor creado exitosamente", doctor: nuevoDoctor });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error al crear el doctor", error: err.message });
    }
};