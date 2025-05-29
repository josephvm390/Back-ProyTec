const { Schema, model } = require("mongoose");

const UsuariosSuscritosSchema = new Schema({
    dni: { type: String, required: true },
    membresia: { type: String, required: true },
    telefono: { type: String, required: true },
    contactoEmer: { type: String, required: true }
});

module.exports = model("UsuariosSuscritos", UsuariosSuscritosSchema);