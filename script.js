const dificultades =
[
    {
        nombre: "easy",
        idBtn: "btn-easy",
        tiempo: 15,
        cantidadCuadrados: 3,
        erroresPermitidos: 1,
    },
    {
        nombre: "hard",
        idBtn: "btn-hard",
        tiempo: 10,
        cantidadCuadrados: 6,
        erroresPermitidos: 4,
    }
]

const estadoJuego =
{
    iniciado: false,
    dificultad: null,
    config: null,
    indiceGanador: -1,
    rondaFinalizada: false,
    contadorRondasGanadas: 0,
    contadorErrores: 0,
}

const elementos =                       // elementos agrupados para un código más prolijo
{
    cuadrados: Array.from(document.querySelectorAll(".square")),   // selecciona los cuadrados y los guarda en una nodelist                  // transforma la nodeList en un array
    reglas: document.getElementById("reglas"),                     // reglas del juego
    btnEasy: document.getElementById("btn-easy"),
    btnHard: document.getElementById("btn-hard"),
    btnPlay: document.getElementById("btn-play"),
    mensaje: document.getElementById("mensaje"),
    colorGanador: document.getElementById("colorGanador"),          // color que debe escoger el usuario para ganar
}


dificultades.forEach(dificultad =>                   // Asigna a cada btn de dificultad un evento (que configurará el juego según la dificultad elegida)
{
    document.getElementById(dificultad.idBtn).addEventListener("click", ()=>
    {
        estadoJuego.dificultad = dificultad.nombre;
        elementos.btnPlay.classList.remove("btn-desactivado");

        ocultarReglas();
        ocultarCuadrados();
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
        estadoJuego.iniciado = true;   
    }
    else
    {
        reiniciarJuego();
        estadoJuego.iniciado = false;
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
                estadoJuego.rondaFinalizada = true;     // impide spamear los cuadrados hasta que se muestren los nuevos
                
                finalizarRondaGanada(index);
                
                estadoJuego.contadorRondasGanadas++;

                console.log("Rondas ganadas: " + estadoJuego.contadorRondasGanadas); // borrar esto despues

                if(estadoJuego.contadorRondasGanadas == 3)
                {
                    console.log("Rata bailando");
                    estadoJuego.rondaFinalizada = true;
                    estadoJuego.contadorRondasGanadas = 0;
                }
                else
                {
                    setTimeout(()=>
                    {
                        reiniciarRonda();
                        asignarColores(estadoJuego.config.cantidadCuadrados);
                        mostrarCuadrados(estadoJuego.config.cantidadCuadrados);
                        mostrarRgb(estadoJuego.config.cantidadCuadrados);
                    }, 2000);
                }
                
            }
            else
            {
                if(estadoJuego.contadorErrores == estadoJuego.config.erroresPermitidos)   // continuar aca
                {
                    estadoJuego.rondaFinalizada = true;
                    estadoJuego.contadorRondasGanadas = 0;                    

                    finalizarJuego();

                }
                else
                {
                    estadoJuego.rondaFinalizada = true;
                    desaparecerCuadrado(index);                    
                    modificarTextContent(elementos.mensaje, "Try again");
                    aplicarAnimacion(elementos.mensaje, "sacudir");
                    elementos.mensaje.style.color = "red";
                    estadoJuego.contadorErrores++;

                    setTimeout(()=>
                    {    
                        estadoJuego.rondaFinalizada = false;        // inhibe clickear un cuadrado para no spamearlo
                    }, 500);
                    

                    console.log("Contador de errores: " + estadoJuego.contadorErrores);     // borrar
                    console.log("Errores permitidos en esta dificultad: " + estadoJuego.config.erroresPermitidos);  // borrar
                }
            }
        }
    });    
});



function iniciarJuego(config)
{
    for(let i=0; i<config.cantidadCuadrados; i++)
    {
        aplicarAnimacion(elementos.cuadrados[i], "expandir");   
    }
        
        ocultarBotonesDificultad(config.nombre);
        desactivarBtn(config.idBtn);
        mostrarRgb(config.cantidadCuadrados);
        
        modificarTextContent(elementos.btnPlay, "BACK");

}



function reiniciarJuego()
{
    reiniciarRonda();               // reseteo del objeto
    estadoJuego.iniciado = false;       
    estadoJuego.dificultad = null;      
    estadoJuego.config = null;
    elementos.btnPlay.classList.add("btn-desactivado");

    mostrarBotonesDificultad();
    mostrarReglas();
    reactivarBtnsDificultad();
    modificarTextContent(elementos.btnPlay, "PLAY");


}

function reiniciarRonda()
{
    estadoJuego.indiceGanador = -1;
    estadoJuego.contadorErrores = 0;
    estadoJuego.rondaFinalizada = false;

    ocultarCuadrados();
    limpiarColores();
    limpiarColorRgb()

    modificarTextContent(elementos.mensaje, "Good luck!");
    elementos.mensaje.style.color = "black";

}


function desactivarBtn(idBtn)
{
    const btnSeleccionado = document.getElementById(idBtn);

    btnSeleccionado.disabled = true;
    btnSeleccionado.classList.add("btn-desactivado");
}

function reactivarBtnsDificultad()
{
    dificultades.forEach(dificultad =>
    {
        const boton = document.getElementById(dificultad.idBtn);
        boton.disabled = false;
        boton.classList.remove("btn-desactivado");
    });
}


function mostrarBotonesDificultad()
{
    dificultades.forEach(d =>
    {
        document.getElementById(d.idBtn).style.visibility = "visible";
    });
}

function mostrarReglas()
{
    elementos.reglas.style.display = "block";
}

function ocultarBotonesDificultad(dificultadElegida)
{
    for(let i=0; i < dificultades.length; i++)
    {
        if(dificultades[i].nombre !== dificultadElegida)
        {
            document.getElementById(dificultades[i].idBtn).style.visibility = "hidden";
        }
    }
}

function ocultarReglas()
{
    elementos.reglas.style.display = "none";
}

function ocultarCuadrados()
{
    for(let i=0; i<elementos.cuadrados.length; i++)
    {
        elementos.cuadrados[i].style.display = "none";
    }
}

function mostrarCuadrados(cantidad)
{
    resetearAnimaciones(elementos.cuadrados, ["expandir", "visibilizar"]);

    for(let i=0; i<cantidad; i++)
    {
        elementos.cuadrados[i].style.display = "flex";
        aplicarAnimacion(elementos.cuadrados[i], "visibilizar");
        elementos.cuadrados[i].style.visibility = "visible";        
    }
}

function generarEnteroAleatorio(minimo, maximo)
{
    return  Math.floor(Math.random() * (maximo - minimo + 1) + minimo);
}

function generarColorRandom()
{
    const r = generarEnteroAleatorio(0, 255);
    const g = generarEnteroAleatorio(0, 255);
    const b = generarEnteroAleatorio(0, 255);
    
    return `rgb(${r}, ${g}, ${b})`;     
}

function asignarColores(cantidad)
{
    for(let i=0; i<cantidad; i++)
    {
        elementos.cuadrados[i].style.backgroundColor = generarColorRandom();
    }
}

function mostrarRgb(cantidad)
{
    let colorGanador = seleccionarColorGanador(cantidad);
    
    modificarTextContent(elementos.colorGanador, colorGanador);
}

function limpiarColorRgb()
{
    modificarTextContent(elementos.colorGanador, "RGB()");
}

function limpiarColores()
{
    elementos.cuadrados.forEach(cuadrado =>
    {
        cuadrado.style.backgroundColor = "";
    });
}

function aplicarAnimacion(elemento, animacion)
{
    elemento.classList.remove(animacion);
    elemento.offsetWidth;
    elemento.classList.add(animacion);
}

function resetearAnimaciones(elementos, animaciones)
{
    elementos.forEach(element =>
    {
        animaciones.forEach(animacion =>
        {
            element.classList.remove(animacion);
        });

        element.offsetWidth; // Forzamos reflow para garantizar que el DOM registre los cambios
    });
}

function seleccionarColorGanador(cantidadCuadrados)
{
    let index = generarEnteroAleatorio(0, cantidadCuadrados-1);
    let colorRgb = elementos.cuadrados[index].style.backgroundColor;
    
    estadoJuego.indiceGanador = index;    // guarda el indice ganador en el objeto global
    
    return colorRgb;
}

function finalizarRondaGanada(indiceGanador)
{
    resetearAnimaciones(elementos.cuadrados, ["expandir", "visibilizar"]);

    for(let i=0; i<estadoJuego.config.cantidadCuadrados; i++)
    {
        elementos.cuadrados[i].style.visibility = "visible";
        elementos.cuadrados[i].style.backgroundColor = elementos.cuadrados[indiceGanador].style.backgroundColor;    
        aplicarAnimacion(elementos.cuadrados[i], "visibilizar");    
    }

    elementos.mensaje.style.color = "green";
    modificarTextContent(elementos.mensaje, "Well done!");
    resetearAnimaciones([elementos.mensaje], ["expandir", "sacudir"]);
    aplicarAnimacion(elementos.mensaje, "expandir");
}

function finalizarJuego()
{
    modificarTextContent(elementos.mensaje, "Game over");
    resetearAnimaciones([elementos.mensaje], ["expandir","sacudir"]);
    aplicarAnimacion(elementos.mensaje, "sacudir");
}


function desaparecerCuadrado(indexCuadrado)
{
    aplicarAnimacion(elementos.cuadrados[indexCuadrado], "expandir");

    setTimeout(()=>
    {    
        elementos.cuadrados[indexCuadrado].style.visibility = "hidden";
    }, 500);
}

function modificarTextContent(elemento, texto)
{
    elemento.textContent = texto;
}

