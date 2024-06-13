const { Router }= require("express");
const router = Router();
const CartsManager = require("../dao/CartsManager.js");
const ProductManager = require("../dao/ProductManagerMONGO.js");
const CartsController = require("../controller/CartsController.js")

const {isValidObjectId} = require("mongoose");
const auth = require("../middleware/auth.js");


const entorno = async() => { 
    const cartManager = new CartsManager();

    const productManager = new ProductManager();

    router.get("/", CartsController.getCart );

    router.get("/:cid", CartsController.getCartById );

    router.post("/", CartsController.createCart );

    router.put("/:cid", CartsController.modifyProductById );

    router.put("/:cid/products/:pid", auth, CartsController.modifyCartProducsById );

    router.delete("/", (req, res) => {
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({status:"error", message:"Debe ingresar un ID de Carrito Para eliminar"});
    });

    router.delete("/:cid", CartsController.deleteProductById );

    router.delete("/:cid/products/:pid", CartsController.deleteProductFromCart );

} //cerrando entorno async

entorno();

module.exports = router;