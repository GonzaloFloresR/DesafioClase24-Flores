const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");

const usuarioCollection = "usuarios";
const usuarioEsquema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email:{type:String, unique:true},
    age: Number,
    password: {type: String, unique: true, }, //required:true
    rol: {type: String, default:"user"},
    cart: {type: mongoose.Types.ObjectId, ref:"carts"}
},{
    timestamps:true,
    strict:false
});

usuarioEsquema.plugin(paginate);

const usuariosModelo = mongoose.model(
    usuarioCollection,
    usuarioEsquema
);


module.exports = usuariosModelo;