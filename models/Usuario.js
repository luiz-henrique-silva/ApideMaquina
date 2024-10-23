const mongoose = require("mongoose");

const Usuario = mongoose.model("Usuario", {
    nome_user: { type: String, required: true },
    email_user: { type: String, required: true, unique: true },
    senha_user: { type: String, required: true },
});

module.exports = Usuario;
