const UsuariosSuscritos = require("../models/UsuariosSuscritos");
const config = require("../config/global");

exports.crearUsuscritos = async (req, res) => {
    try {
        const { dni, membresia, telefono, contactoEmer } = req.body;

        const nuevoRegistro = new UsuariosSuscritos({ dni, membresia, telefono, contactoEmer });
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
exports.InfoUsu = async (req, res) => {
    try {
        const { dni } = req.params;

        const usuario = await UsuariosSuscritos.findOne({ dni });

        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json(usuario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener datos del usuario" });
    }
};

