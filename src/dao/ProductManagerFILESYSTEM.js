const fs = require("fs");

class ProductManagerFILESYSTEM {
    #products;
    #path;

    constructor(rutaDeArchivo){

        this.#path = rutaDeArchivo;
        this.inicializar();
    }

    async inicializar(){
        this.#products = await this.#BuscarArchivo();
    }

    #asignarIdProducto(){
        let id = 1;
        if(this.#products.length != 0 ){
            id = this.#products[this.#products.length - 1].id + 1;
        }
        return id;
    }


    #BuscarArchivo = async () => { //Agregue async
        try {
                if(fs.existsSync(this.#path)){
                    return this.#products = JSON.parse( await fs.promises.readFile(this.#path, "utf-8"));
                } else {
                    return [];
                }
        } catch(error){
            console.log("Problemas al buscar el archivo ",error);
        }
    }

    #guardarArchivo = async () => { //Agregue async
        try {
            await fs.promises.writeFile(this.#path, JSON.stringify(this.#products, null, 5)); // Agregue await y promise y borre writeFileSync
        } catch(error){
            console.log("Problemas al guardar el archivo ",error);
        }
    }

    async addProduct(title, description, price, thumbnail, code, stock){ 

        if(!title || !description || !price || !code || !stock){

            return `🛑 Se require completar todos los parametros: title, description, price, thumbnail, code, stock`;

        } else {

            let repetido = this.#products.some( pro => pro.code === code.trim()); //validar que no se repita el code

            if(repetido){

                return false;"🛑 There is already a product with this code 🛑"

            } else {
                
                if (thumbnail) {thumbnail = thumbnail.replace("/Applications/MAMP/htdocs/ClaseBackend/Desafio5/src/public", "..")}  

                const nuevoProducto = {
                        id: this.#asignarIdProducto(),
                        title:title,
                        description:description,
                        price:price,
                        thumbnail:thumbnail || "../img/SinImagen.png",
                        code:code,
                        stock:stock
                    };
                
                this.#products.push(nuevoProducto);
                try {
                    await this.#guardarArchivo();
                return true;//`✅ Product added successfully ✅`
                }
                catch(error){
                    console.log(error);
                }
                
            }
        }
    }

    getProducts(){
        return this.#products; //Devolver todos los productos
    }

    getProductById(id){
        let producto = this.#products.find((prod)=>prod.id === id);
        return producto? producto : false; //`🛑 Product ID: ${id} Not Found 🛑`
    } 

    async updateProduct(id, Update){
        const index = this.#products.findIndex((produc) => produc.id === id );
        if(index >= 0){
            const {id, ...rest} = Update;
            this.#products[index] = {...this.#products[index], ...rest};
            try {
                await this.#guardarArchivo(); 
                return `Archivo Actualizado`;
            }
            catch(error){
                console.log(error.message);
            }
            
        }else{
            return `El producto con el id: ${id} no existe`;
        }
    }

    async deleteProduct(pid){
        const index = this.#products.findIndex((produc) => produc.id === pid );
        if(index >= 0 ){
            this.#products =  this.#products.filter(produc => produc.id !== pid);
            try {
                await this.#guardarArchivo();
                return true; //`Producto Eliminado Correctamente ✅`
            }
            catch(error){
                return false; //"Error al elinminar el producto";
            }
            
        } else {
            return false; //`🛑 El producto con el Id ${id} no existe`
        }
    }

}

module.exports = ProductManagerFILESYSTEM;
