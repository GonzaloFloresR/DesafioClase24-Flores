const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const path = require('path');
const {engine} = require("express-handlebars");
const {Server} = require("socket.io");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const initPassport = require("./config/passport.config.js");

const mensajesModelo = require("./dao/models/MenssageModel.js");

const productsRouter = require("./routes/products_routers.js");
const cartRouter = require("./routes/carts_router.js");
const vistasRouter = require("./routes/views_router.js");
const sessionRouter = require("./routes/session_router.js");

const PORT = 8080;
const app = express();

app.use(express.json()); 
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret:"CoderCoder123",
    resave:true,
    saveUninitialized:true,
    store:MongoStore.create({
        ttl:3600,
        mongoUrl:"mongodb+srv://gonzalof:Coder098@cluster0.pt1wq7n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
        dbName:"ecommerce",
        collectionName:"sessions"
    })
}));
initPassport();
app.use(passport.initialize());
app.use(passport.session()); // Solo si uso sessions
app.use(cookieParser());

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname,'/views'));


app.use(express.static(__dirname+'/public'));

//Estoy agregando un middleware literal en flecha y enviando io al products_routers
app.use("/api/products/", (req, res, next) => {
        req.io = io;
        next();
    },
    productsRouter
); 
app.use("/api/carts/", cartRouter);
app.use("/", vistasRouter);
app.use("/api/sessions/", sessionRouter);

const serverHTTP = app.listen(PORT, () => console.log(`Server online en puerto ${PORT}`)); 
const io = new Server(serverHTTP);

let usuarios = [];
let mensajes = [];

io.on("connection", socket => {
    //console.log(`Se conecto un cliente con el ID ${socket.id}`);
    
    socket.on("id", async(nombre) => {
        usuarios.push({id:socket.id, nombre});
        try {mensajes = await mensajesModelo.find().lean();}
        catch(error){`Error desde el servidor recuperando mensajes ${error}`}
        
        socket.emit("mensajesPrevios", mensajes);
        socket.broadcast.emit("nuevoUsuario", nombre ); //Le envio a todos menos al que se conecto
    });

    socket.on("mensaje", async(nombre, mensaje) => {
        //mensajes.push({nombre, mensaje}); // Guadar mensajes
        try {
            let guardado = await mensajesModelo.create({user:nombre,message:mensaje});
        } catch(error){`Error en el servidor guardando mensajes ${error}`}
        
        io.emit("nuevoMensaje", nombre, mensaje); //io envia a Todos
    });

    socket.on("disconnect", () => {
        let usuario = usuarios.find(user => user.id === socket.id);
        if(usuario){
            io.emit("saleUsuario", usuario.nombre)
        }
    })
});

const connDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://gonzalof:Coder098@cluster0.pt1wq7n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
        {dbName:"ecommerce"});
        console.log("DB MONGO ONLINE");
    } catch (error) {
        console.log("Error al conectar a la DB", error.message)
    }
} 
connDB();