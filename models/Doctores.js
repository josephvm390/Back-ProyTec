const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const doctorSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    celular: { type: String, required: true },
    correo: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    imagenPath: {
        type: String, // Ruta de la imagen guardada en carpeta
        required: true
    }
});

doctorSchema.methods.encryptPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hash(password, salt);
};

doctorSchema.methods.validatePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Doctor', doctorSchema);