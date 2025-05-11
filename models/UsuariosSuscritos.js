const { Schema, model } = require("mongoose");

const UsuariosSuscritosSchema = new Schema({
    dni: { type: String, required: true },
    membresia: { type: String, required: true }
});

module.exports = model("UsuariosSuscritos", UsuariosSuscritosSchema);