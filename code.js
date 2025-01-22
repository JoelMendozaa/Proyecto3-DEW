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
        localStorage.setItem("aviones", JSON.stringify(aviones));  // Guardamos los aviones en localStorage
    }
}

// Cargar los asientos ocupados desde sessionStorage
function cargarAsientosOcupados(avion) {
    const asientosGuardados = sessionStorage.getItem(avion.name);
    if (asientosGuardados) {
        avion.asientosOcupados = asientosGuardados.split(',');  // Convertir el string de asientos ocupados a array
    }
}

// Guardar los asientos seleccionados en sessionStorage
function storageSession(avion, asientoId) {
    avion.asientosOcupados.push(asientoId);  // Añadir asiento al array de ocupados
    sessionStorage.setItem(avion.name, avion.asientosOcupados.join(','));  // Guardar los asientos ocupados en sessionStorage
}

function asientos(avion) {
    const $container = $('#seat-container');
    $container.empty();  // Limpiar el contenido del contenedor antes de generar los nuevos asientos

    const $table = $('<table></table>');  // Crear la tabla de asientos con jQuery

    for (let fila = 0; fila < avion.rows; fila++) {
        const $row = $('<tr></tr>');  // Crear la fila con jQuery
        $row.addClass(fila <= 3 ? 'fila-naranja' : 'fila-azul');  // Asignar color de fondo según la fila
        
        // Crear un array temporal con posiciones de asientos para la fila actual
        let asientosFila = Array.from({ length: avion.columns }, (_, i) => i);
        
        // Mezclar el array para que los asientos se asignen aleatoriamente
        asientosFila = asientosFila.sort(() => Math.random() - 0.5);
        
        // Determinar la mitad de los asientos que serán ocupados (rojo)
        let mitadAsientos = Math.floor(avion.columns / 2);

        for (let columna = 0; columna < avion.columns; columna++) {
            const asientoId = `asiento-${fila + 1}-${columna + 1}`;
            const $button = $('<button></button>');  // Crear el botón con jQuery
            $button.attr('id', asientoId)
                .addClass('seat')
                .text(`${fila + 1}-${columna + 1}`);

            // Asignar color según la aleatorización
            if (asientosFila.indexOf(columna) < mitadAsientos) {
                $button.css('background-color', 'red');  // Ocupado
            } else {
                $button.css('background-color', 'green');  // Disponible
            }

            // Añadir eventos para seleccionar/deseleccionar asientos
            $button.on('click', function () {
                if ($button.css('background-color') === 'rgb(0, 128, 0)') {  // Si es verde (disponible)
                    $button.css('background-color', 'red');  // Cambia a rojo (ocupado)
                    storageSession(avion, asientoId);  // Guardar asiento como ocupado en sessionStorage
                } else {
                    console.log("No se puede, ya está ocupado"); // Mensaje en consola si ya está ocupado
                }
                actualizarPrecio(avion);  // Actualizar el precio cada vez que se selecciona un asiento
            });

            // Añadir el botón (asiento) a la celda de la tabla
            const $cell = $('<td></td>').append($button);
            $row.append($cell);
        }

        $table.append($row);  // Añadir la fila a la tabla
    }

    $container.append($table);  // Añadir la tabla generada al contenedor de asientos

    cargarAsientosOcupados(avion);  // Cargar los asientos ocupados desde sessionStorage (si ya existen)
    marcarAsientosOcupados(avion);  // Marcar visualmente los asientos ocupados
}

// Marcar asientos ocupados visualmente en el DOM
function marcarAsientosOcupados(avion) {
    avion.asientosOcupados.forEach(asientoId => {
        const $asiento = $(`#${asientoId}`);
        if ($asiento.length) {
            $asiento.css('background-color', 'red');  // Marcar como rojo (ocupado)
        }
    });
}

// Calcular el precio total basado en los asientos ocupados
function actualizarPrecio(avion) {
    const precioTotal = avion.asientosOcupados.length * avion.priceBase;
    $('#precioTotal').text(`Precio Total: €${precioTotal}`); // Muestra el precio total en pantalla
}

// Inicialización
storageLocal();  // Llamada inicial para guardar los aviones en localStorage
