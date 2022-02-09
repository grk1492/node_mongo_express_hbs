// Crée par Joachim Zadi le 17/04/2020 à 10:27
// ===========================================

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    fullName: {
        type: String,
        required: [true, "Le nom complet est requis !!!"]
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mdp: {
        type: String,
        required: true
    }
});

let User = mongoose.model("Users", UserSchema);

module.exports = User;