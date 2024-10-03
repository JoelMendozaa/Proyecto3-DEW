function Avion(name, rows, column, price) { // Objeto avión
    this.name = name;
    this.rows = rows;           // Constructor
    this.column = column;
    this.priceBase = price;
    this.color = [];           // Array para almacenar el color de los asientos
}

// Se crean los objetos con sus respectivos nombres de las aerolíneas y constructor.
const binter = new Avion("Binter", 20, 6, 120);
const iberiaExpress = new Avion("Iberia", 25, 6, 100);
const vueling = new Avion("Vueling", 15, 4, 140);

function asientos(avion) {
    document.write(`<table>`);
    for (let fila = 0; fila < avion.rows; fila++) { // Generación asientos
        let claseFila = '';
        if (fila <= 3) {
            claseFila = 'fila-naranja'; // Color a los asientos de primera clase
        } else if (fila > 3 && fila <= 9) {
            claseFila = 'fila-azul'; // Color a los asientos de clase turista
        }

        document.write(`<tr class="${claseFila}">`); // Creación de tabla para cada asiento generado
        console.log("Filas " + (fila + 1));
        for (let columna = 0; columna < avion.column; columna++) {
            let asientoId = `asiento-${fila + 1}-${columna + 1}`; // Crear el ID para cada asiento en función de su fila y columna

            // Generamos aleatoriamente el color del asiento (verde o rojo)
            let colorAsiento = Math.random() < 0.5 ? 'green' : 'red'; // Verde = disponible, Rojo = ocupado
            avion.color.push({ id: asientoId, color: colorAsiento }); // Guardamos el color en un array para verificar más tarde

            document.write(`
                <td>
                    <div id="${asientoId}" class="seat" style="background-color: ${colorAsiento};">  
                        ${fila + 1} - ${columna + 1}
                    </div> 
                </td>
            `);
            console.log("Columnas " + (columna + 1));
        }
        document.write(`</tr>`);
    }
    document.write(`</table>`);
}