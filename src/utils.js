/**
 * Cambia el valor de display de un elemento HTML
 * @param {HTMLElement} elemento - El elemento al que se aplica la propiedad.
 * @param {string} display - Valor CSS para asignar al display (por defecto es "block").
 */
export function setDisplay(elemento, display = "block")
{
    elemento.style.display = display;
}


/**
 * Cambia la visibilidad de un elemento HTML
 * @param {HTMLElement} elemento - El elemento al que se aplica la visibilidad.
 * @param {string} estado - Valor CSS para visibility ("visible", "hidden", etc).
 */
export function cambiarVisibilidadElemento(elemento, estado)
{
    elemento.style.visibility = estado;
}


/**
 * Modifica el contenido textual de un elemento HTML.
 * @param {HTMLElement} elemento - Elemento al que se cambia el texto.
 * @param {string} texto - Texto nuevo para asignar.
 */
export function modificarTextContent(elemento, texto)
{
    elemento.textContent = texto;
}


/**
 * Aplica una animación CSS reiniciándola para que se reproduzca correctamente.
 * @param {HTMLElement} elemento - Elemento al que se le aplica la animación.
 * @param {string} animacion - Nombre de la clase de animación.
 */
export function aplicarAnimacion(elemento, animacion)
{
    elemento.classList.remove(animacion);
    elemento.offsetWidth; // Fuerza reflow para reiniciar la animación
    elemento.classList.add(animacion);
}


/**
 * Remueve múltiples animaciones de una lista de elementos y fuerza reflow.
 * @param {HTMLElement[]} elementos - Array de elementos a reiniciar.
 * @param {*} animaciones - Lista de clases de animación a quitar.
 */
export function removerAnimaciones(elementos, animaciones)
{
    elementos.forEach(element =>
    {
        animaciones.forEach(animacion =>
        {
            element.classList.remove(animacion);
        });

        element.offsetWidth; // Reinicia el flujo del DOM para actualizar animación
    });
}


/**
 * Genera un número entero aleatorio entre un mínimo y un máximo incluidos.
 * @param {number} minimo - Valor mínimo.
 * @param {number} maximo - Valor máximo.
 * @returns {number} Número aleatorio entre mínimo y máximo.
 */
export function generarEnteroAleatorio(minimo, maximo)
{
    return  Math.floor(Math.random() * (maximo - minimo + 1) + minimo);
}


/**
 * Genera un color RGB aleatorio en formato string.
 * @returns {string} Color RGB en formato "rgb(r, g, b)".
 */
export function generarColorRandom()
{
    const r = generarEnteroAleatorio(0, 255);
    const g = generarEnteroAleatorio(0, 255);
    const b = generarEnteroAleatorio(0, 255);
    
    return `rgb(${r}, ${g}, ${b})`;     
}