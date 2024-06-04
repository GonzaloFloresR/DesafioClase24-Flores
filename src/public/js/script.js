const socket = io();


const divProductos = document.getElementById("productos");
socket.on("NuevoProducto", NewProduct => {
    divProductos.innerHTML += ` <ul data-id=${NewProduct._id}>
                                    <li><h3> ${NewProduct.title}<h3></li>
                                    <li> ${NewProduct.description} </li>
                                    <li>$ ${NewProduct.price} </li>
                                    <li><img src=${NewProduct.thumbnail} alt=${NewProduct.description} width="250" > </li>
                                    <li>Código ${NewProduct.code} </li>
                                    <li class="codigo">Id: ${NewProduct._id}</li>
                                    <li>Stock Actual ${NewProduct.stock} </li>
                                    <li><button class="comprar" data-id=${NewProduct._id} onclick="Agregar()" >Agregar al carrito</button></li>
                                </ul>`;
});

socket.on("ProductoEliminado", pid => {
    let lista = document.getElementById("productos");
    let productoEliminar =lista.querySelector("ul[data-id='"+pid+"']");
    if(productoEliminar){
        productoEliminar.remove();
    }
});

socket.on("ProductoActualizado", NewProduct => {
    let lista = document.getElementById("productos");
    let productoActualizar =lista.querySelector("ul[data-id='"+NewProduct._id+"']");
    productoActualizar.innerHTML = "";
    productoActualizar.innerHTML += `
                                    <li><h3> ${NewProduct.title}<h3></li>
                                    <li> ${NewProduct.description} </li>
                                    <li>$ ${NewProduct.price} </li>
                                    <li><img src=${NewProduct.thumbnail} alt=${NewProduct.description} width="250" > </li>
                                    <li>Código ${NewProduct.code} </li>
                                    <li>Stock Actual ${NewProduct.stock} </li>
                                    <li><button class="comprar" data-id=${NewProduct._id} onclick="Agregar()" >Agregar al carrito</button></li>`;
});


function handleClick(event) {
    const dataId = event.target.getAttribute('data-id'); // Obtener el valor del atributo data-id
    console.log('Hiciste clic en el botón con data-id:', dataId);
    // Aquí puedes realizar las acciones que desees con el botón seleccionado
}

  // Seleccionar todos los botones con atributo data-id
const botones = document.querySelectorAll('button[data-id]');

  // Agregar un event listener a cada botón
botones.forEach(function(boton) {
    boton.addEventListener('click', handleClick);
});


