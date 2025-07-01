const dificultades =
[
    {
        nombre: "easy",
        idBtn: "btn-easy",
        tiempo: 15,
        cantidadCuadrados: 3,
        erroresPermitidos: 2,
    },
    {
        nombre: "hard",
        idBtn: "btn-hard",
        tiempo: 10,
        cantidadCuadrados: 6,
        erroresPermitidos: 5,
    }
]

const elementos =                       // elementos agrupados para un código más prolijo
{
    cuadrados: Array.from(document.querySelectorAll(".square")),   // selecciona los cuadrados y los guarda en una nodelist                  // transforma la nodeList en un array
    reglas: document.getElementById("reglas"),                     // reglas del juego
    btnEasy: document.getElementById("btn-easy"),
    btnHard: document.getElementById("btn-hard"),
    btnPlay: document.getElementById("btn-play"),
    colorGanador: document.getElementById("colorGanador"),
}

let dificultadElegida;                                              // dificultad elegida por el usuario
let juegoIniciado = false;
let indiceGanador;

dificultades.forEach(dificultad =>                   // Asigna a cada btn de dificultad un evento (que configurará el juego según la dificultad elegida)
{
    document.getElementById(dificultad.idBtn).addEventListener("click", ()=>
    {
        dificultadElegida = dificultad.nombre;
        elementos.btnPlay.classList.remove("btn-desactivado");

        ocultarReglas();
        ocultarCuadrados();
        asignarColores(dificultad.cantidadCuadrados);
        mostrarCuadrados(dificultad.cantidadCuadrados);
        reactivarBtnsDificultad();
        desactivarBtnDificultad(dificultad.idBtn);
    });

    
});

elementos.btnPlay.addEventListener("click", ()=>
{
    if(!juegoIniciado)
    {        
        const config = dificultades.find(d => d.nombre === dificultadElegida);      // busca la dificultad que seleccionó el usuario y guarda la referencia en otro objeto
        
        iniciarJuego(config);
        juegoIniciado = true;   
    }
    else
    {
        reiniciarJuego();
        juegoIniciado = false;
    }
    
});



function iniciarJuego(config)
{
    for(let i=0; i<config.cantidadCuadrados; i++)
    {
        
        aplicarAnimacion(elementos.cuadrados[i], "expandir");
        
    }
        
        ocultarBotonesDificultad(config.nombre);
        desactivarBtnDificultad(config.idBtn);
        mostrarRgb(config.cantidadCuadrados);
        
        elementos.btnPlay.textContent = "VOLVER";

}

function reiniciarJuego()
{
    dificultadElegida = null;       // reestablece la dificultad
    elementos.btnPlay.classList.add("btn-desactivado");

    mostrarBotonesDificultad();
    ocultarCuadrados();
    limpiarColores();
    limpiarColorRgb()
    mostrarReglas();
    reactivarBtnsDificultad();

    elementos.btnPlay.textContent = "PLAY";
}


function desactivarBtnDificultad(idBtn)
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
    resetearAnimaciones(["expandir", "visibilizar"]);

    for(let i=0; i<cantidad; i++)
    {
        elementos.cuadrados[i].style.display = "flex";

        aplicarAnimacion(elementos.cuadrados[i], "visibilizar");
        
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

function mostrarRgb(cantidad)// revisar esta funcion
{
    let colorGanador = seleccionarColorGanador(cantidad); // ver esto
    
    elementos.colorGanador.textContent = colorGanador;
}

function limpiarColorRgb()
{
    elementos.colorGanador.textContent = "RGB()";
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

function resetearAnimaciones(animaciones)
{
    elementos.cuadrados.forEach(cuadrado =>
    {
        animaciones.forEach(animacion =>
        {
            cuadrado.classList.remove(animacion);
        });

        cuadrado.offsetWidth; // Forzamos reflow para garantizar que el DOM registre los cambios
    });
}

function seleccionarColorGanador(cantidadCuadrados)
{
    indiceGanador = generarEnteroAleatorio(0, cantidadCuadrados-1); // ver esto

    return elementos.cuadrados[indiceGanador].style.backgroundColor;
}
