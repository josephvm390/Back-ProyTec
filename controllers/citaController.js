const Cita = require("../models/Cita");
const config = require("../config/global");

exports.crearCita = async (req, res) => {
    try {
        const { //colocado en forma de lista para mejor visualizacion de datos
            modalidad,
            direccion,
            fecha,
            hora,
            nombre_doctor,
            correo_doctor,
            nombre_paciente,
            apellido_paciente,
            email,
            celular_paciente
        } = req.body;

        // Crear nueva cita
        const nuevaCita = new Cita({
            modalidad,
            direccion,
            fecha,
            hora,
            nombre_doctor,
            correo_doctor,
            nombre_paciente,
            apellido_paciente,
            email,
            celular_paciente,
            estado: "pendiente"
        });

        // Guardar en la base de datos
        const citaGuardada = await nuevaCita.save();

        res.status(201).json({
            message: "Cita creada exitosamente",
            cita: citaGuardada
        });
    } catch (error) {
        console.error("Error al crear la cita:", error);
        res.status(500).json({
            message: "Ocurrió un error al crear la cita",
            error: error.message
        });
    }
};

exports.obtenercitas = async (req, res) => {
    try {
        const citas = await Cita.find();
        res.json(citas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener citas' });
    }
};

exports.obtenerCitaxCorreo = async (req, res) => {
    try {
        const { email } = req.params;

        const citas = await Cita.find({ email });

        res.status(200).json(citas);
        
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las citas por correo' });
    }
};

exports.editarCita = async (req, res) => {
    try {
        const { id } = req.params;
        const datosActualizados = req.body;

        const citaActualizada = await Cita.findByIdAndUpdate(
            id,
            datosActualizados,
            { new: true }
        );

        if (!citaActualizada) {
            return res.status(404).json({ message: "Cita no encontrada" });
        }

        res.status(200).json({
            message: "Cita actualizada exitosamente",
            cita: citaActualizada
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar la cita",
            error: error.message
        });
    }
};

exports.obtenerCitaxCorreoDoc = async (req, res) => {
    try {
        const { correo } = req.params;

        const citas = await Cita.find({ correo_doctor: correo });

        res.status(200).json(citas);
        
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las citas por correo del doctor' });
    }
};
