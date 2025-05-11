const mongoose = require("mongoose");

const conectarDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://josephvillavicencio35:57EU9QOYhmI9zxMg@cluster0.hlba3zc.mongodb.net/SmartFit", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Base de datos conectada");
    } catch (error) {
        console.log(error);
        throw new Error("Error al conectar a la base de datos");
        process.exit(1);
    }
};

module.exports = conectarDB;