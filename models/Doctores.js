const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    celular: { type: String, required: true },
    correo: { type: String, required: true, unique: true },
    imagenPath: {
        type: String, // Ruta de la imagen guardada en carpeta
        required: true
    }
});

module.exports = mongoose.model('Doctor', doctorSchema);