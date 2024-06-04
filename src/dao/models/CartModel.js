let mongoose = require("mongoose");

const cartsCollection = "carts";
const cartsEsquema = new mongoose.Schema(
    {
        products: { type:   [
                                {
                                    productId: {
                                        type: mongoose.Types.ObjectId,
                                        ref: "products"
                                    },
                                    quantity: Number
                                }
                            ]
        }
    },
    {
        timestamps:true,
        strict:true
    }
);

//Se puede agregar el populate aqui o en CartManager al consultar con find()
cartsEsquema.pre("find", function(){this.populate({path:"products.productId"})});

const cartsModelo = mongoose.model(
    cartsCollection,
    cartsEsquema
);

module.exports = cartsModelo;
