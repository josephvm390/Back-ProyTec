const Cita = require("../models/Cita");
const config = require("../config/global");
const nodemailer = require('nodemailer');
require('dotenv').config();

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

exports.actulizarCita = async (req, res) => { //se agrego logica para poder realizar envio de email al actualizar datos.
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

        const fechaFormateada = new Date(citaActualizada.fecha).toLocaleDateString('es-PE', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });

        // configuracion de nodemailer y se utiliza el .env
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        let mailOptions;

        if (citaActualizada.estado === "Cancelado") {
            mailOptions = {
                from: `"Smart Fit" <${process.env.EMAIL_USER}>`, //Estructura del mensaje a enviar
                to: citaActualizada.email,
                subject: 'Cancelación de Cita',
                text: `Buen dia ${citaActualizada.nombre_paciente},\n\n` +
                    `Se le comunica mediante este correo que su cita ha sido cancelada por motivos de fuerza mayor.\n` +
                    `El doctor a cargo se estará comunicando con usted dentro de las próximas 24 horas para coordinar una nueva fecha.\n\n` +
                    `Disculpe las molestias del caso.\n` +
                    `Que tenga un buen día.`
            };
        } else {
            mailOptions = {
                from: `"Smart Fit" <${process.env.EMAIL_USER}>`, //Estructura del mensaje a enviar
                to: citaActualizada.email,
                subject: 'Reprogramación de Cita',
                text: `Buen dia ${citaActualizada.nombre_paciente},\n\n` +
                    `Su cita ha sido reprogramada para el día ${fechaFormateada} a las ${citaActualizada.hora}.\n` +
                    `Lo esperamos.\n\nGracias y que tenga buen día.`
            };
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error al enviar correo:', error);
            } else {
                console.log('Correo enviado:', info.response);
            }
        });

        res.status(200).json({
            message: "Cita actualizada exitosamente y correo enviado",
            cita: citaActualizada
        });

    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar la cita",
            error: error.message
        });
    }
};

exports.cancelarCitaPaciente = async (req, res) => {
    try {
        const { id } = req.params;

        const cita = await Cita.findByIdAndUpdate(id, { estado: 'Cancelado' }, { new: true });

        if (!cita) {
            return res.status(404).json({ message: 'Cita no encontrada' });
        }

        //configuracion de nodemailer y se utiliza el .env
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        const fechaFormateada = new Date(cita.fecha).toLocaleDateString('es-PE', { //para formatear la cita que sale en ingles
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });

        const mailOptions = { //Estructura del mensaje a enviar
            from: `"Smart Fit" <${process.env.EMAIL_USER}>`,
            to: cita.correo_doctor,
            subject: 'Cancelación de Cita por Paciente',
            text: `Estimado(a) Doctor(a) ${cita.nombre_doctor},\n\n` +
                `El paciente ${cita.nombre_paciente} ${cita.apellido_paciente} ha cancelado su cita programada para el día ${fechaFormateada} a las ${cita.hora}.\n\n` +
                `Atentamente,\nSmart Fit`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Cita cancelada y correo enviado al doctor' });

    } catch (error) {
        console.error("Error al cancelar cita del paciente:", error);
        res.status(500).json({ error: 'Error al cancelar cita del paciente' });
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

exports.solicitudReprogramacion = async (req, res) => { //para el boton de solicitar Reprogramacion de Cita
    try {
        const { id } = req.params;
        const cita = await Cita.findById(id);

        if (!cita) {
            return res.status(404).json({ message: 'Cita no encontrada' });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const fechaFormateada = new Date(cita.fecha).toLocaleDateString('es-PE', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });

        const mailOptions = { //Estructura del mensaje a enviar
            from: `"Smart Fit" <${process.env.EMAIL_USER}>`,
            to: cita.correo_doctor,
            subject: 'Solicitud de Reprogramación de Cita',
            text: `Estimado(a) doctor(a) ${cita.nombre_doctor},\n\n` +
                `El paciente ${cita.nombre_paciente} ${cita.apellido_paciente}, quien tiene una cita programada para el día ${fechaFormateada} a las ${cita.hora}, desea reprogramar su cita.\n\n` +
                `Por favor, comuníquese con el paciente dentro de las próximas 48 horas.\n\nAtentamente,\nSmart Fit`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: `Se envió su solicitud al doctor ${cita.nombre_doctor}. Se comunicará con usted en un plazo máximo de 48 horas.` });

    } catch (error) {
        console.error("Error al solicitar reprogramación:", error);
        res.status(500).json({ error: 'Error al enviar la solicitud de reprogramación' });
    }
};

