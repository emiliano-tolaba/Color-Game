import { dificultades } from "./dificultades.js";
import { elementos } from "./elementos.js";
import { estadoJuego } from "./estado.js";
import { fx } from "./fx.js";
import
{
    setDisplay, cambiarVisibilidadElemento, modificarTextContent,
    aplicarAnimacion, removerAnimaciones,
    generarEnteroAleatorio, generarColorRandom
} from "./utils.js";


dificultades.forEach(dificultad =>                   // Asigna a cada btn de dificultad un evento (que configurará el juego según la dificultad elegida)
{
    document.getElementById(dificultad.idBtn).addEventListener("click", ()=>
    {
        estadoJuego.dificultad = dificultad.nombre;
        elementos.btnPlay.classList.remove("btn-desactivado");

        setDisplay(elementos.reglas, "none");
        ocultarContainerCuadrados();
        asignarColores(dificultad.cantidadCuadrados);
        mostrarCuadrados(dificultad.cantidadCuadrados);
        reactivarBtnsDificultad();
        desactivarBtn(dificultad.idBtn);
    });
});

elementos.btnPlay.addEventListener("click", ()=>
{
    if(!estadoJuego.iniciado)
    {            
        estadoJuego.config = dificultades.find(d => d.nombre === estadoJuego.dificultad);      // busca la dificultad que seleccionó el usuario y guarda la referencia en otro objeto
        
        iniciarJuego(estadoJuego.config);
    }
    else
    {        
        reiniciarJuego();
    }
    
});

elementos.cuadrados.forEach((cuadrado, index) =>
{
    cuadrado.addEventListener("click", ()=>
    {
        if(estadoJuego.indiceGanador != -1 && !estadoJuego.rondaFinalizada)
        {
            if(index == estadoJuego.indiceGanador)
            {                                                
                registrarRondaGanada(index);                

                if(estadoJuego.contadorRondasGanadas == 3)  // rondas necesarias para la victoria del juego
                {                                                                                
                    mostrarRecompensa();
                }
                else
                {
                    empezarRondaNueva();    // contiene un timeout de 2 segundos
                }
            }
            else
            {
                if(estadoJuego.contadorErrores == estadoJuego.config.erroresPermitidos)
                {                                      
                    finalizarJuego();
                }
                else
                {
                    registarErrorJugador(index);                    
                }
            }
        }
    });    
});

/**
 * Inicializa la partida según la configuración de dificultad.
 * Reproduce sonido de inicio, anima los cuadrados y prepara la interfaz.
 * @param {Object} config - Objeto de configuración con datos de la dificultad.
 */
function iniciarJuego(config)
{
    estadoJuego.iniciado = true;   

    fx.start.play();

    for(let i=0; i<config.cantidadCuadrados; i++)
    {
        aplicarAnimacion(elementos.cuadrados[i], "expandir");   
    }
        
        ocultarBotonesDificultad(config.nombre);
        desactivarBtn(config.idBtn);
        mostrarRgb(config.cantidadCuadrados);        
        modificarTextContent(elementos.btnPlay, "BACK");
}


/**
 * Resetea por completo el juego.
 * Limpia estado, oculta recompensa, reinicia botones y elimina timeouts activos.
 */
function reiniciarJuego()
{
    reiniciarRonda();               
    estadoJuego.iniciado = false;
    estadoJuego.dificultad = null;  // reseteo del objeto           
    estadoJuego.config = null;
    estadoJuego.contadorRondasGanadas = 0;
    elementos.btnPlay.classList.add("btn-desactivado");
    setDisplay(elementos.containerCuadrados, "flex");    
    setDisplay(elementos.containerRecompensa, "none");
    
    fx.victoria.pause();
    fx.victoria.currentTime = 0;
    
    mostrarBotonesDificultad();
    mostrarReglas();
    reactivarBtnsDificultad();
    modificarTextContent(elementos.btnPlay, "PLAY");

    if(estadoJuego.timeoutReinicio)     // borra el timeout de reinicio de ronda
    {
        clearTimeout(estadoJuego.timeoutReinicio);
        estadoJuego.timeoutReinicio = null;
    }
}


/**
 * Finaliza el juego tras superar los errores permitidos.
 * Reproduce sonido de game over y muestra feedback visual.
 */
function finalizarJuego()
{
    fx.gameOver.play();
    estadoJuego.rondaFinalizada = true;
    estadoJuego.contadorRondasGanadas = 0;
    
    modificarTextContent(elementos.mensaje, "Game over");
    removerAnimaciones([elementos.mensaje], ["expandir","sacudir"]);
    aplicarAnimacion(elementos.mensaje, "sacudir");
}


/**
 * Reinicia una ronda individual sin alterar el progreso total.
 * Limpia colores, oculta cuadrados y resetea mensaje.
 */
function reiniciarRonda()
{
    estadoJuego.indiceGanador = -1;
    estadoJuego.contadorErrores = 0;
    estadoJuego.rondaFinalizada = false;

    ocultarContainerCuadrados();
    limpiarColores();
    limpiarColorRgb()

    modificarTextContent(elementos.mensaje, "Good luck!");
    elementos.mensaje.style.color = "black";
}


/**
 * Muestra la recompensa final si se alcanzó el número de rondas ganadas.
 * Aplica animación visual y reproduce audio en loop.
 */
function mostrarRecompensa()
{
    fx.victoria.play();
    fx.victoria.loop = true;
    
    setTimeout(()=>
    {
        if(estadoJuego.iniciado) // valida que no se haya salido del juego para mostrar la animación
        {
            setDisplay(elementos.containerCuadrados, "none");
            setDisplay(elementos.containerRecompensa);                     
            aplicarAnimacion(elementos.containerRecompensa, "visibilizar");
        }
        
    }, 2300);
}


/**
 * Inicia una nueva ronda después de un pequeño delay.
 * Reasigna colores, actualiza cuadrados y presenta nuevo RGB objetivo.
 */
function empezarRondaNueva()
{
    estadoJuego.timeoutReinicio = setTimeout(()=>
    {
        reiniciarRonda();

        if(estadoJuego.iniciado && estadoJuego.config)        // valida que el juego siga iniciado antes de mostrar los nuevos colores
        {
            asignarColores(estadoJuego.config.cantidadCuadrados);
            mostrarCuadrados(estadoJuego.config.cantidadCuadrados);
            mostrarRgb(estadoJuego.config.cantidadCuadrados);
        }
        
    }, 2000);
}


/**
 * Registra una ronda ganada por el jugador.
 * Muestra retroalimentación visual, pinta todos los cuadrados del color correcto,
 * actualiza el contador de victorias y bloquea interacción temporal.
 * @param {number} indiceGanador - Índice del cuadrado correcto.
 */
function registrarRondaGanada(indiceGanador)
{
    fx.correct.play();
    estadoJuego.rondaFinalizada = true;     // impide spamear los cuadrados hasta que se muestren los nuevos

    removerAnimaciones(elementos.cuadrados, ["expandir", "visibilizar"]);

    for(let i=0; i<estadoJuego.config.cantidadCuadrados; i++)
    {
        cambiarVisibilidadElemento(elementos.cuadrados[i], "visible")        
        elementos.cuadrados[i].style.backgroundColor = elementos.cuadrados[indiceGanador].style.backgroundColor;    
        aplicarAnimacion(elementos.cuadrados[i], "visibilizar");    
    }

    elementos.mensaje.style.color = "green";
    modificarTextContent(elementos.mensaje, "Well done!");
    removerAnimaciones([elementos.mensaje], ["expandir", "sacudir"]);
    aplicarAnimacion(elementos.mensaje, "expandir");

    estadoJuego.contadorRondasGanadas++;
}


/**
 * Registra un error cuando el jugador hace clic en un cuadrado incorrecto.
 * Reproduce sonido, aplica animaciones, incrementa contador de errores
 * y bloquea temporalmente la interacción para evitar spam.
 * @param {number} index - Índice del cuadrado clickeado.
 */
function registarErrorJugador(index)
{
    fx.error.play();
    desaparecerCuadrado(index);                    
    modificarTextContent(elementos.mensaje, "Try again");
    aplicarAnimacion(elementos.mensaje, "sacudir");
    elementos.mensaje.style.color = "red";

    estadoJuego.contadorErrores++;
    estadoJuego.rondaFinalizada = true;

    setTimeout(()=>
    {    
        estadoJuego.rondaFinalizada = false;        // inhibe clickear un cuadrado para no spamearlo
    }, 500);
}


/**
 * Desactiva un botón de dificultad mediante su ID.
 * @param {string} idBtn - ID del botón a desactivar.
 */
function desactivarBtn(idBtn)
{
    const btnSeleccionado = document.getElementById(idBtn);

    btnSeleccionado.disabled = true;
    btnSeleccionado.classList.add("btn-desactivado");
}


/**
 * Reactiva todos los botones de dificultad disponibles.
 */
function reactivarBtnsDificultad()
{
    dificultades.forEach(dificultad =>
    {
        const boton = document.getElementById(dificultad.idBtn);
        boton.disabled = false;
        boton.classList.remove("btn-desactivado");
    });
}


/**
 * Muestra todos los botones de dificultad en la interfaz.
 */
function mostrarBotonesDificultad()
{
    dificultades.forEach(d =>
    {
        cambiarVisibilidadElemento(document.getElementById(d.idBtn), "visible");
    });
}


/**
 * Muestra el bloque de reglas en pantalla.
 */
function mostrarReglas()
{
    setDisplay(elementos.reglas);
}


/**
 * Oculta los botones de dificultad que no coincidan con la dificultad elegida.
 * @param {string} dificultadElegida - Nombre de la dificultad seleccionada.
 */
function ocultarBotonesDificultad(dificultadElegida)
{
    for(let i=0; i < dificultades.length; i++)
    {
        if(dificultades[i].nombre !== dificultadElegida)
        {
            cambiarVisibilidadElemento(document.getElementById(dificultades[i].idBtn), "hidden");            
        }
    }
}


/**
 * Aplica animación de rebote a un cuadrado y luego lo oculta.
 * @param {number} indexCuadrado - Índice del cuadrado a ocultar.
 */
function desaparecerCuadrado(indexCuadrado)
{
    aplicarAnimacion(elementos.cuadrados[indexCuadrado], "expandir");

    setTimeout(()=>
    {   
        cambiarVisibilidadElemento(elementos.cuadrados[indexCuadrado], "hidden");
    }, 500);
}

/**
 * Oculta todos los cuadrados del contenedor principal.
 */
function ocultarContainerCuadrados()
{
    for(let i=0; i<elementos.cuadrados.length; i++)
    {
        setDisplay(elementos.cuadrados[i], "none");
    }
}


/**
 * Muestra la cantidad de cuadrados especificada con animación y visibilidad.
 * @param {number} cantidad - Cantidad de cuadrados a mostrar.
 */
function mostrarCuadrados(cantidad)
{
    removerAnimaciones(elementos.cuadrados, ["expandir", "visibilizar"]);

    for(let i=0; i<cantidad; i++)
    {
        setDisplay(elementos.cuadrados[i], "flex");        
        aplicarAnimacion(elementos.cuadrados[i], "visibilizar");
        cambiarVisibilidadElemento(elementos.cuadrados[i], "visible");            
    }
}


/**
 * Asigna colores aleatorios a los cuadrados visibles.
 * @param {number} cantidad - Cantidad de cuadrados a colorear.
 */
function asignarColores(cantidad)
{
    for(let i=0; i<cantidad; i++)
    {
        elementos.cuadrados[i].style.backgroundColor = generarColorRandom();
    }
}


/**
 * Selecciona aleatoriamente uno de los cuadrados como el ganador.
 * Guarda el índice en el estado global y devuelve su color.
 * @param {number} cantidadCuadrados - Número total de cuadrados visibles.
 * @returns {string} Color RGB del cuadrado ganador.
 */
function seleccionarColorGanador(cantidadCuadrados)
{
    let index = generarEnteroAleatorio(0, cantidadCuadrados-1);
    let colorRgb = elementos.cuadrados[index].style.backgroundColor;
    
    estadoJuego.indiceGanador = index;    // guarda el indice ganador en el objeto global
    
    return colorRgb;
}


/**
 * Elimina el color de fondo de todos los cuadrados.
 */
function limpiarColores()
{
    elementos.cuadrados.forEach(cuadrado =>
    {
        cuadrado.style.backgroundColor = "";
    });
}


/**
 * Limpia el texto del color RGB mostrado.
 */
function limpiarColorRgb()
{
    modificarTextContent(elementos.colorGanador, "RGB()");
}


/**
 * Muestra el color RGB objetivo al jugador y lo actualiza en pantalla.
 * @param {number} cantidad - Cantidad de cuadrados entre los que se elige el ganador.
 */
function mostrarRgb(cantidad)
{
    let colorGanador = seleccionarColorGanador(cantidad);
    
    modificarTextContent(elementos.colorGanador, colorGanador);
}