// Crée par Joachim Zadi le 14/04/2020 à 16:54
// ===========================================
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    title: {
        type: String,
        required: [true, "Le titre du message est requis !!!"]
    },
    content: {
        type: String,
        required: [true, "Le titre du message est requis !!!"]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

let Message = mongoose.model("Message", MessageSchema);

module.exports = Message;
