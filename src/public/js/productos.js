const comprar = async(pid) => {
    let inputCarrito = document.getElementById("carrito");
    let cid = inputCarrito.value;

    console.log(`Codigo Producto ${pid} / Código Carrito es ${cid}`);
    try {
        let respuesta = await fetch(`/api/carts/${cid}/products/${pid}`,{method:"put"});
        if(respuesta.status === 200){
        let datos = await respuesta.json();
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: `Producto Agregado al carrito`,
            text: `Producto ${pid} agregado al carrito ${cid}`,
            showConfirmButton: false,
            timer: 3000
        });
        }
    } 
    catch(error){error.menssage} 
}
