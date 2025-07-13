export const elementos =                       
{
    cuadrados: Array.from(document.querySelectorAll(".square")),   // selecciona los cuadrados y los guarda en una nodelist que después transforma en array           
    reglas: document.getElementById("reglas"),                     // reglas del juego
    btnEasy: document.getElementById("btn-easy"),
    btnHard: document.getElementById("btn-hard"),
    btnPlay: document.getElementById("btn-play"),
    mensaje: document.getElementById("mensaje"),
    containerCuadrados: document.getElementById("container-squares"),
    containerRecompensa: document.getElementById("container-recompensa"),
    colorGanador: document.getElementById("colorGanador"),          // color que debe escoger el usuario para ganar
}