const usuariosModelo = require("./models/UsuarioModel.js");

class UsersManager{

    async createUsuario(usuario){
        let nuevoUsuario = await usuariosModelo.create(usuario);
        return nuevoUsuario.toJSON();
    }

    async getUsuarioBy(filtro={},proyeccion={}){
        return await usuariosModelo.findOne(filtro,proyeccion).lean();
    }


}

module.exports = UsersManager;