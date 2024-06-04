let mongoose = require("mongoose");

const messagesCollection = "messages";
const messageEsquema = new mongoose.Schema({
    user: String,
    message: String,
},{
    timestamps:true
});

const mensajesModelo = mongoose.model(
    messagesCollection,
    messageEsquema
);


module.exports = mensajesModelo;