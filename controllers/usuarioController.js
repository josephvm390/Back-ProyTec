const Usuario = require("../models/Usuario");
const config = require("../config/global");
const UsuariosSuscritos = require("../models/UsuariosSuscritos");


exports.createUsuario = async (req, res) => {
    try {
        const {
            name, lastName, email, confirmEmail, password, confirmPassword, dni
        } = req.body;
        if (email !== confirmEmail) {
            return res.status(400).json({ message: "Los correos no coinciden" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Las contraseñas no coinciden" });
        }

        const registro = await UsuariosSuscritos.findOne({ dni });
        if (!registro) {
            return res.status(400).json({ message: "El DNI no está registrado en SmartFit" });
        }

        const usuario = new Usuario({
            name,
            lastName,
            email,
            confirmEmail,
            password,
            confirmPassword,
            dni
        });

        await usuario.save();

        res.status(201).json({
            message: "Usuario creado exitosamente",
            usuario: usuario
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Correo de Usuario ya existente" });
    }
};

exports.loginUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;
        const usuario = await Usuario.findOne({ email: email });

        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        if (usuario.password !== password) {
            return res.status(404).json({ message: "Contraseña incorrecta" });
        }

        res.status(200).json({
            message: "Inicio exitoso",
            usuario: usuario,
            auth: true,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};