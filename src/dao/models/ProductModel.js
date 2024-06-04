const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");

const productCollection = "products";
const productosEsquema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    thumbnail: String,
    code: {type: String, unique: true, required:true},
    stock: {type: Number, default:0}
},{
    timestamps:true
});

productosEsquema.plugin(paginate);

const productoModelo = mongoose.model(
    productCollection,
    productosEsquema
);


module.exports = productoModelo;