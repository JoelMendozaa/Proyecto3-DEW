function Avion(name, rows, columns, priceBase) {
    this.name = name;
    this.rows = rows;
    this.columns = columns;
    this.priceBase = priceBase;
    this.asientosOcupados = [];
}

// Aviones definidos
const binter = new Avion("Binter", 20, 6, 120);
const iberiaExpress = new Avion("Iberia", 25, 6, 100);
const vueling = new Avion("Vueling", 15, 4, 140);

// LocalStorage para guardar aviones
function storageLocal() {
  if (!localStorage.getItem("aviones")) {
    const aviones = [binter, iberiaExpress, vueling];
    localStorage.setItem("aviones", JSON.stringify(aviones));
    console.log("Aviones almacenados en localStorage:", localStorage.getItem("aviones"));
  } else {
    console.log("Aviones ya están en localStorage");
  }

  // Intentar recuperar los aviones y verificar si la deserialización funciona
  const avionesGuardados = localStorage.getItem("aviones");
}

// Cargar los asientos ocupados desde sessionStorage
function cargarAsientosOcupados(avion) {
    const asientosGuardados = sessionStorage.getItem(avion.name);
    if (asientosGuardados) {
        avion.asientosOcupados = asientosGuardados.split(',');  // Convertir string en array
    }
}

// Guardar los asientos seleccionados en sessionStorage
function storageSession(avion, asientoId) {
    avion.asientosOcupados.push(asientoId);  // Añadir asiento al array de ocupados
    sessionStorage.setItem(avion.name, avion.asientosOcupados.join(','));  // Guardar en sessionStorage
}

function asientos(avion) {
    const container = document.getElementById('seat-container');
    container.innerHTML = '';  // Limpiar el contenido del contenedor

    const table = document.createElement('table');  // Crear tabla

    for (let fila = 0; fila < avion.rows; fila++) {
        const row = document.createElement('tr');  // Crear fila
        row.className = fila <= 3 ? 'fila-naranja' : 'fila-azul';
        let asientosFila = Array.from({ length: avion.columns }, (_, i) => i);   // Crear un array temporal con posiciones de asientos
        asientosFila = asientosFila.sort(() => Math.random() - 0.5);      // Mezclar el array para que los asientos se asignen aleatoriamente
        let mitadAsientos = Math.floor(avion.columns / 2);        // Determinar la mitad de los asientos que serán ocupados (rojo)

        for (let columna = 0; columna < avion.columns; columna++) {
            const asientoId = `asiento-${fila + 1}-${columna + 1}`;
            const button = document.createElement('button');
            button.id = asientoId;
            button.className = 'seat';
            button.textContent = `${fila + 1}-${columna + 1}`;

            // Asignar color según la aleatorización
            if (asientosFila.indexOf(columna) < mitadAsientos) {
                button.style.backgroundColor = 'red';  // Ocupado
            } else {
                button.style.backgroundColor = 'green';  // Disponible
            }

            // Añadir eventos para seleccionar/deseleccionar asientos
            button.addEventListener('click', function () {
                if (button.style.backgroundColor === 'green') {
                    button.style.backgroundColor = 'red';  // Cambia a rojo (ocupado)
                    storageSession(avion, asientoId);  // Guardar en sessionStorage
                } else if (button.style.backgroundColor === 'red') {
                    console.log("No se puede, ya está ocupado"); // Mensaje en consola
                }
                actualizarPrecio(avion);  // Actualizar precio cada vez que se selecciona un asiento
            });

            // Añadir el botón a la celda de la tabla
            const cell = document.createElement('td');
            cell.appendChild(button);
            row.appendChild(cell);
        }

        table.appendChild(row);
    }

    container.appendChild(table);  // Añadir tabla al contenedor

    cargarAsientosOcupados(avion);  // Cargar asientos ocupados de la sesión anterior
    marcarAsientosOcupados(avion);  // Marcar visualmente los asientos ocupados
}

// Marcar asientos ocupados visualmente en el DOM
function marcarAsientosOcupados(avion) {
    avion.asientosOcupados.forEach(asientoId => {
        const asiento = document.getElementById(asientoId);
        if (asiento) {
            asiento.style.backgroundColor = 'red';  // Marcar como ocupado
        }
    });
}

// Calcular el precio total basado en los asientos ocupados
function actualizarPrecio(avion) {
    const precioTotal = avion.asientosOcupados.length * avion.priceBase;
    document.getElementById('precioTotal').textContent = `Precio Total: €${precioTotal}`; // Muestra el precio total
}

// Inicialización
storageLocal();