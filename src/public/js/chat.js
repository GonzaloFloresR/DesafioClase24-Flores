Swal.fire({
    title: "Identifiquese",
    input: "text",
    text: "Ingrese su Correo Electrónico",
    inputValidator: (value) => {
        return !value && "Debe ingresar un Email...!!!"
    },
    allowOutsideClick:false
}).then(datos => {
    
    let nombre = datos.value;
    document.title = `${nombre} Super chat WebSocket 2024`;
    let inputMensaje = document.getElementById("mensaje");
    let divMensajes = document.getElementById("mensajes");
    inputMensaje.focus();

    const socket = io();

    socket.emit("id", nombre);

    socket.on("nuevoUsuario", nombre => {
        Swal.fire({
            text:`${nombre} se ha conectado...!!!`,
            toast: true, 
            position:"top-right"
        })
    });

    socket.on("mensajesPrevios", mensajes => {
        mensajes.forEach( mensaje => {
            divMensajes.innerHTML += `<span class="mensaje"><strong>${mensaje.user}</strong> dice: <i>${mensaje.message}</i></span>`;
            divMensajes.scrollTop = divMensajes.scrollHeight;
        });
    });

    socket.on("saleUsuario", nombre => {
        divMensajes.innerHTML += `<span class="mensaje"><strong>${nombre}</strong> ha salido del chat... 🙁 <i></i></span>`;
        divMensajes.scrollTop = divMensajes.scrollHeight;
    });

    inputMensaje.addEventListener("keyup", evento => {
        evento.preventDefault();
        //console.log(evento, evento.target.value);
        if(evento.code === "Enter" && evento.target.value.trim().length > 0){
            socket.emit("mensaje", nombre, evento.target.value.trim());
            evento.target.value = "";
            evento.target.focus();
        }
    })

    socket.on("nuevoMensaje",(nombre, mensaje) => {
        divMensajes.innerHTML += `<span class="mensaje"><strong>${nombre}</strong> dice: <i>${mensaje}</i></span>`;
        divMensajes.scrollTop = divMensajes.scrollHeight;
    });

}) //fin then swal

