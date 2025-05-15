const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const usuarioSchema = new Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dni: { type: String, required: true }
});

usuarioSchema.methods.encryptPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hash(password, salt);
};

usuarioSchema.methods.validatePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

module.exports = model("Usuario", usuarioSchema);