const express = require("express");
const conectarDB = require("./config/db");
const cors = require("cors");
const config = require("./config/global");

const app = express();

// Conexión a la base de datos
conectarDB();

// Configurar CORS
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT"]
}));

// Middleware para parsear JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use("/", (req, res)=> {
//     res.send("api funciona")
// })
app.use("/api/usuario", require("./routes/usuario"));
app.use("/api/suscritos", require("./routes/usuariosSuscritos"));

app.listen(config.port, () =>
    console.log(`Servidor corriendo en http://localhost:${config.port}`)
);