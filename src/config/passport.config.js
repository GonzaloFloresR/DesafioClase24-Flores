const passport = require("passport");
const local = require("passport-local");
const GitHub = require("passport-github2");
const UsuarioManager = require("../dao/UsersManager.js");
const CartsManager = require("../dao/CartsManager.js");
const {generaHash, validaPassword} = require("../utils.js"); 

const cartsManager = new CartsManager();
const usuarioManager = new UsuarioManager();

const initPassport = () => {
    
    passport.use(
        "github",
        new GitHub.Strategy(
            {
                clientID:"Iv23liK3HzRiINoNgoC7",
                clientSecret:"73c63df9be3b7f02010a523cafa995cebb8d4ec8",
                callbackURL:"http://localhost:8080/api/sessions/callbackGithub"
            },
            async(tokenAcceso, tokenRefresh, profile, done) => {
                try { //Try de passport
                    //console.log(profile,"Desde linea 23 en passporConfig");
                    let email = profile._json.email;
                    let nombre = profile._json.name;
                    if(!email){
                        return done(nullm, false);
                    }
                    let usuario = await usuarioManager.getUsuarioBy({email});
                    if(!usuario){
                        let cart = await cartsManager.crearCarrito();
                        usuario = await usuarioManager.createUsuario({
                            first_name:nombre, email, cart, profile
                        });
                    }
                    return done(null, usuario);

                } // Cerrando Try de passport
                catch(error){
                    return done(error);
                }
            }
        )
    );// cerrando Github

    passport.use(
        "registro",
        new local.Strategy(
            {
                usernameField:"email",
                passReqToCallback: true
            },
            async(req, username, password, done) => {
                try { //Try de passport
                    
                    let {nombre:first_name, apellido:last_name, edad:age, rol} = req.body;
                    if(!first_name){
                        return done(null, false);//No hay error, pero no hay usuario.
                    }
                    
                    let emailCheck = await usuarioManager.getUsuarioBy({email: username});
                    if(emailCheck){
                        return done(null, false);
                    }
                    
                    let cart = await cartsManager.crearCarrito();
                    password = generaHash(password);
                    let usuario = {first_name,last_name,age, email:username, password, rol, cart};
                    let nuevoUsuario = await usuarioManager.createUsuario(usuario);
                    if(nuevoUsuario){
                        nuevoUsuario = {...nuevoUsuario}
                        delete nuevoUsuario.password;
                        return done(null, nuevoUsuario);
                    }
                    
                } // Cerrando Try de passport
                catch(error){
                    return done(error);
                }
            }
        )
    );

    passport.use(
        "login",
        new local.Strategy(
            {
                usernameField:"usuario"
            },
            async(username, password, done) => {
                try { //try de estrategia
                        existeUsuario = await usuarioManager.getUsuarioBy({"email":username});
                        if (!existeUsuario){
                            return done(null, false);
                        } else {
                            if(!validaPassword(password, existeUsuario.password)){
                                return done(null, false);
                            }
                            return done(null, existeUsuario);
                        }
                        
                    } //Finalizando el try
                    catch(error){
                        return done(error);
                    }
            })
    );

    //Cerrando registro y login
    passport.serializeUser((usuario, done) => {
        return done(null, usuario._id)
    });

    passport.deserializeUser(async(id,done) => {
        let usuario = await usuarioManager.getUsuarioBy({_id:id});
        return done(null, usuario)
    });

}

module.exports = initPassport;