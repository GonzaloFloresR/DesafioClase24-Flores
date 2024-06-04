const cartsModelo = require("../dao/models/CartModel.js");

class CartsManager {

    async getCarritos(limit=10){
        try {
            //El populate se puede agregar aqui en la consulta o como middleware pre en el esquema
            //return await cartsModelo.find().populate("products.productId").limit(limit).lean();
            return await cartsModelo.find().limit(limit).lean();
        }
        catch(error){
            console.log(error,"Error desde getCarritos");
        }
    }

    async getCarritoBy(filter){
        return await cartsModelo.find(filter).lean();
    }

    //{products:[{productId:"",quantity:1},{products:[{productId:"",quantity:1}]}
    async crearCarrito(NuevoCarrito){
        try {
            return await cartsModelo.create(NuevoCarrito);
        }
        catch(error){
            console.log(error,"Error desde crearCarrito");
        }
    }

    async getCarritoById(cid){
        try {
            return await cartsModelo.findById(cid).populate("products.productId").lean(); //{_id:cid}
        } 
        catch(error){console.log(error, "Error en el getCarritoById")}
    }

    async getCarritoByIdNotPopulate(cid){
        try {
            return await cartsModelo.findById(cid).lean(); //{_id:cid}
        } 
        catch(error){console.log(error, "Error en el getCarritoById")}
    }

    async updateCart(cid, update){
        try {
            //Ejemplo incrementar 1 {"$inc":{"stock": 1}}
            return await cartsModelo.findByIdAndUpdate({"_id":cid}, update,{runValidators:true, new:true, upsert:true});
        }
        catch(error){
            console.log(error.message ,"Error desde updateCart");
        }
    }

    async deleteCarrito(cid){
        try{
            return await cartsModelo.findByIdAndDelete(cid);
        }
        catch(error){
            console.log(error,"Error desde deleteProduct")
        }
    }

}
module.exports = CartsManager;