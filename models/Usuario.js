const { Schema, model } = require("mongoose");

const usuarioSchema = new Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dni: { type: String, required: true }
});

module.exports = model("Usuario", usuarioSchema);