const API_URL = 'http://localhost:3000/productos';

async function obtenerProductos() {
    try {
        const respuesta = await fetch(API_URL);
        const productos = await respuesta.json();

        const contenedorProductos = document.querySelector('.productos-grid');
        const noProductos = document.querySelector('.no-productos');

        contenedorProductos.innerHTML = ''; 
        if (productos.length === 0) {
            noProductos.style.display = 'block'; 
        } else {
            noProductos.style.display = 'none'; 
            productos.forEach(producto => {
                const productoCard = document.createElement('div');
                productoCard.classList.add('producto-card');
                productoCard.innerHTML = `
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <h3>${producto.nombre}</h3>
                    <p class="precio">$ ${producto.precio}</p>
                    <!-- Asegurándonos de que el ID sea un string para pasar correctamente -->
                    <button class="btn-borrar" onclick="eliminarProducto('${producto.id}')">🗑️</button>
                `;
                contenedorProductos.appendChild(productoCard);
            });
        }
    } catch (error) {
        console.error('Error al obtener los productos:', error);
    }
}

async function agregarProducto(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const precio = parseFloat(document.getElementById('precio').value);
    const imagen = document.getElementById('imagen').value;

    if (nombre && precio && imagen) {
        // Generar un ID único de 3 dígitos
        const id = generarID();

        // Crear el nuevo producto con el ID generado
        const nuevoProducto = { id, nombre, precio, imagen };

        try {
            const respuesta = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevoProducto)
            });

            if (respuesta.ok) {
                obtenerProductos(); 
                alert('Producto agregado exitosamente');
            } else {
                alert('Error al agregar el producto');
            }
        } catch (error) {
            console.error('Error al agregar el producto:', error);
        }
    }
}

function generarID() {
    // Aquí generamos un ID aleatorio de tres dígitos
    // Asegúrate de que siempre tenga tres dígitos, por ejemplo 001, 023, 050, etc.
    return (Math.floor(Math.random() * 900) + 100).toString(); // Convertimos el número a string
}

async function eliminarProducto(id) {
    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (respuesta.ok) {
            obtenerProductos(); 
            alert('Producto eliminado');
        } else {
            alert('Error al eliminar el producto');
        }
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
    }
}

document.addEventListener('DOMContentLoaded', obtenerProductos);

const formulario = document.querySelector('form');
formulario.addEventListener('submit', agregarProducto);
