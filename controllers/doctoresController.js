const Doctores = require("../models/Doctores");
const config = require("../config/global");
const jwt = require("jsonwebtoken");

exports.crearDoctor = async (req, res) => {
    try {
        const { nombre, celular, correo, password } = req.body;

        // Validar que se subió una imagen
        if (!req.file) {
            return res.status(400).json({ message: "Imagen requerida" });
        }
        // Verificar si el correo ya existe
        const existe = await Doctores.findOne({ correo });
        if (existe) {
            return res.status(400).json({ message: "El correo ya está registrado" });
        }

        const nuevoDoctor = new Doctores({
            nombre,
            celular,
            correo,
            password,
            imagenPath: req.file.path
        });

        nuevoDoctor.password = await nuevoDoctor.encryptPassword(password);
        await nuevoDoctor.save();

        const token = jwt.sign({ id: nuevoDoctor._id }, config.secret, {
            expiresIn: 60 * 60 * 24, // 24 horas
        });

        res.status(201).json({
            message: "Doctor creado exitosamente",
            doctor: nuevoDoctor,
            auth: true,
            token: token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear el doctor", error: error.message });
    }
};

exports.loginDoctor = async (req, res) => {
    try {
        const { correo, password } = req.body;

        const doctor = await Doctores.findOne({ correo });
        if (!doctor) {
            return res.status(404).json({ message: "Doctor no encontrado" });
        }

        const validPassword = await doctor.validatePassword(password);
        if (!validPassword) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        const token = jwt.sign({ id: doctor._id }, config.secret, {
            expiresIn: 60 * 60 * 24, // 24 horas
        });

        res.status(200).json({
            message: "Inicio exitoso",
            doctor: doctor,
            auth: true,
            token: token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al iniciar sesión", error: error.message });
    }
};