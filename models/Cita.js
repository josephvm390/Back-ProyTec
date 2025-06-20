const { Schema, model } = require("mongoose");

const Citas = new Schema({
    modalidad: { type: String, required: true },
    direccion: { type: String, required: true },
    fecha: { type: Date, required: true },
    hora: { type: String, required: true },
    nombre_doctor: { type: String, required: true },
    nombre_paciente: { type: String, required: true },
    apellido_paciente: { type: String, required: true },
    email: { type: String, required: true },
    celular_paciente: { type: String, required: true },
    estado: {type: String, required: true}
});

module.exports = model("Cita", Citas);