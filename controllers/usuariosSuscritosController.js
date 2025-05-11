const UsuariosSuscritos = require("../models/UsuariosSuscritos");
const config = require("../config/global");

exports.crearUsuscritos = async (req, res) => {
    try {
        const { dni, membresia } = req.body;

        const nuevoRegistro = new UsuariosSuscritos({ dni, membresia });
        await nuevoRegistro.save();

        res.status(201).json({
            message: "Registro creado correctamente",
            registro: nuevoRegistro
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear el registro" });
    }
};

