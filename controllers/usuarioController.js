const Usuario = require("../models/Usuario");
const config = require("../config/global");
const UsuariosSuscritos = require("../models/UsuariosSuscritos");
const jwt = require("jsonwebtoken");


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

        usuario.password = await usuario.encryptPassword(usuario.password);
        await usuario.save();

        const token = jwt.sign({ id: usuario._id }, config.secret, {
            expiresIn: 60 * 60 * 24, // 24 horas
        });

        res.status(201).json({
            message: "Usuario creado exitosamente",
            usuario: usuario,
            auth: true,
            token: token
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

        const validContra = await usuario.validatePassword(password);
        if (!validContra) {
            return res.status(404).json({ message: "Contraseña incorrecta" });
        }

        const token = jwt.sign({ id: usuario._id }, config.secret, {
            expiresIn: 60 * 60 * 24, // 24 horas
        });

        res.status(200).json({
            message: "Inicio exitoso",
            usuario: usuario,
            auth: true,
            token: token,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.listUsuarios = async (req, res) => { //Api de prueba
    try {
        const usuarios = await Usuario.find();
        res.status(200).json({
            message: "Lista de usuarios obtenida correctamente",
            usuarios: usuarios
        });
    } catch (error) {
        console.error("Error al listar usuarios:", error);
        res.status(500).json({ message: "Error al obtener usuarios" });
    }
}

exports.UserDetails = async (req, res) => {
    try {
        const { email } = req.params;

        const user = await Usuario.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado",
            });
        }

        res.status(200).json(user); // Devuelve todo el documento completo
    } catch (error) {
        console.error(error);
        res.status(500).send("Hubo un error");
    }
};