document.addEventListener("DOMContentLoaded", function(){ // Espera a que todo lo html se cargue para ejecutar la funcion
  const selectContainer = document.querySelector(".custom-select"); /* hace una variable constante, usa queryselector porque 
                                                                    selecciona una clase de css "por eso el "." al inicio"*/
  const selected = selectContainer.querySelector(".selected");      /* usa el "selectContainer" porque eso contiene el div principal y por ende es el padre
                                                                   entonces usa al padre para usar al hijo que seria el "seleccionador" */
  const options = selectContainer.querySelector(".options");     // toma en cuenta el css del div que engloba las monedas
  const optionItems = selectContainer.querySelectorAll(".option"); // usa "querySelectorAll" para tomar en cuenta todas las opciones(criptos) de su css         
  
  selected.addEventListener("click", () => { // cuando haces click en la seleccion que ocurra algo
    selectContainer.classList.toggle("open"); // usa "classlist" para modificar las clase css y toogle para verificar
  });//                                           si existe o no, entonces si no hay lo agrega y si hay lo quita. Como un interruptor
                                                                  
   
  optionItems.forEach(option =>{ // recorre cada elemento de la lista de los option(criptomonedas)
    option.addEventListener("click", () =>{
      selected.innerHTML = option.innerHTML + `<div class="arrow">▼</div>`// con el "innerHtml" cambia el contenido html y dice que el html de seleccion 
    //                                                                     sea igual a la option y de paso añada un arrow. Asi la option(cripto) se muestra en select

    selected.setAttribute("data-value", option.getAttribute("data-value")); // actualiza el data-value
    selectContainer.classList.remove("open")                             // remueve el "open" en la clase de la seleccion, se cierra el menu.
    })
  });

  document.addEventListener("click", (e)=>{// cuando se haga click en el cualquier lado 
    if (!selectContainer.contains(e.target)){ // si el objetivo "(e.target)" no forma parte de "selectContainer"(div principal) entonces:
      //                                         sino entonces es verdadero. 
      selectContainer.classList.remove("open"); // remueve una clase del div principal

    }
    
  });

  document.addEventListener("keydown", (e) => {// detecta si usas la tecla
    if (e.key === "Enter" || e.key === "ArrowDown"){ // si la "e" (objetivo general, no especifico) es "enter" o "flechaAbajo" entonces:
      selectContainer.classList.add("open"); // se añade una clase al div principal que se llame "open", asi abre el menu
    } else if (e.key === "Escape" || e.key === "ArrowUp"){
      selectContainer.classList.remove("open"); // en caso contrario que lo elimine;
    }
  });
});

document.addEventListener("DOMContentLoaded", function(){
  const seleccion_total = document.querySelector(".custom-select-monedas");
  const seleccionador   = seleccion_total.querySelector(".selected-moneda");
  const opciones        = seleccion_total.querySelector(".options_moneda");
  const opcion          = seleccion_total.querySelectorAll(".option_moneda");

  seleccionador.addEventListener("click", () => { /* si haces click en el seleccionador */
    seleccion_total.classList.toggle("open"); /* que añada la clase "open" si existe, y sino que lo quite (toggle)*/
  })

  opcion.forEach(opcion => { /* recorre todas las monedas (opcion)*/
    opcion.addEventListener("click", () =>{ /* accion si haces click en el div de las monedas*/
      seleccionador.innerHTML = opcion.innerHTML + `<div class="arrow">▼</div>`; /* cambia el contenido html de seleccionador,  */
                                                                                 /* que sea igual al html de las monedas + el arrow */
      seleccionador.setAttribute("data-value", opcion.getAttribute("data-value"));                                                                          
      seleccion_total.classList.remove("open");                                  /* cierra el menu*/                                                                      
    });
  });

  document.addEventListener("click", (e) =>{
    if (!seleccion_total.contains(e.target)){// si el objetivo (e) no esta en la seleccion en general
      seleccion_total.classList.remove("open"); // se remueve la clase de css de open, osea, cierra el menu. 
    }
  })

});

async function cargartasasdecambio() {
const id_hojadatos = `1wjsn7SFBWQk-aWXVSJ7MWTguGx1wJa8Vt-Z5BI4f_Vc`;
const apikey = `AIzaSyAP_fOHpPUB3o3UP64YtYGB6Kz83a5GF6s`;
const rango = `Hoja 1!A50:B104`;
const url = `https://sheets.googleapis.com/v4/spreadsheets/${id_hojadatos}/values/${rango}?key=${apikey}`;
  try{
    const response = await fetch(url);
    if (!response.ok) throw new Error (`Error: ${response.status}`);
    const data = await response.json();
    const filas = data.values;

    const nombresMonedas = [];
    const valoresMonedas = {}; // usamos corchetes porque estos tienen claves unicas y [] no tiene.

    filas.forEach(fila =>{
      const codigo = fila[0].trim(); // hacemos un array que tenga el nombre de la moneda, y sea fila 1.
      //                                       ademas con .trim() eliminamos el espacio, "usd" y no " usd ".
      const tasa          = parseFloat(fila[1].replace(",", "."));
      
      if (codigo && !isNaN(tasa)){// si esta el nombre de la moneda y si la tasa si es un numero ("!isNaN", no es un numero)
        //                                  entonces:
        nombresMonedas.push(codigo); // array de nombres entra en el array de la fila[0]
        valoresMonedas[codigo] = tasa; // hacemos una clave dentro del array con el nombre de cada moneda y que tenga su tasa
                                               // se veria asi: USD: 1$, EURO: 2.4$ y asi va. Simplemente esta guardando los datos
      } 
    });
      console.log("Monedas Paises:", valoresMonedas);
      return {nombresMonedas, valoresMonedas};// devuelve los valores al objeto, asi podemos utilizar sus datos fuera de la funcion
                                              // sino tuvieramos "return" no podriamos sacar los datos y utilizarlos para otras funciones.

  } catch (error){
    console.error("Error Obtenido Datos de Google Sheets:", error);
  }
}

async function obtenerCriptomonedas() {
  const url = "https://api.binance.com/api/v3/ticker/price";

  try{
    const response = await fetch(url);
    const data = await response.json();

    const nombresCriptos = []; // array con nombres 
    const valoresCriptos = {}; // array con los valores

    data.forEach(cripto =>{ // recorremos todos los datos de la api de binance
      if (cripto.symbol.endsWith("USDT")){ // si la criptomoneda termina en "USDT":
        const nombre = cripto.symbol.replace("USDT", ""); // creamos una variable que quite el "USDT" y lo deje en blanco
                                                          // entonces asi la criptomoneda pasaria de "BTCUSDT" a "BTC".
                                                          // usa "symbol" porque en la api binance symbol es el nombre de la cripto, symbol: BTC ejemplo
        nombresCriptos.push(nombre);// metes solamente los nombres de las criptos en el array de nombres
        valoresCriptos[nombre] = parseFloat(cripto.price);// metemos en el array de valores tanto el nombre como la tasa del cripto
                                                          // [nombre] es una clave para identificar la criptomoneda.
                                                          // de esta forma el array quedaria asi: BTC([nombre]): 1$[cripto.price];
                                                          // es como si tuvieramos una caja y estuvieramos colocando las cosas por un nombre y un precio distinto de cada uno

      }
    });

    console.log("Criptomonedas:", valoresCriptos);
    return { nombresCriptos, valoresCriptos}; // devuelve los valores al objeto, asi podemos utilizar sus datos fuera de la funcion
                                              // sino tuvieramos "return" no podriamos sacar los datos y utilizarlos para otras funciones.

  }catch (error){
    console.error("Error obteniendo datos de Binance:", error);
  }
}

async function actualizarDivs() {
  const  { valoresMonedas} = await cargartasasdecambio();// desestructuramos los datos para poder utilizarlos mas comodo, osea, estamos separandos entre los nombres y las tasas
  const  {valoresCriptos} = await obtenerCriptomonedas();// hacemos lo mismo, para que podamos acceder a los datos mas comodamente. 

  // guardar tasa de las monedas
  document.querySelectorAll(".option_moneda").forEach(option =>{ // recorremos todas las monedas
    const codigo = option.getAttribute("data-value"); // y hacemos una variable que lea el data-value de cada una, asi estamos leyendo cada moneda y guardandola.

    if (valoresMonedas[codigo]){// si esta la tasa de las monedas
      option.setAttribute("data-rate", valoresMonedas[codigo]); // añadimos un atributo en cada moneda para que se guarden las tasas de cada moneda("data-rate")
     console.log(`Moneda ${codigo} tasa: ${valoresMonedas[codigo]}`);// aqui detalla el nombre de la moneda junto a su tasa
    }
  });

  // guardar tasas de las criptomonedas
  document.querySelectorAll(".option").forEach(option =>{
    const codigo = option.getAttribute("data-value");

    if (valoresCriptos[codigo]){ // si esta la tasa de la criptomoneda
      option.setAttribute("data-rate", valoresCriptos[codigo]); // se añade un atributo llamado "data-rate" que almacenara las tasas(valoresCriptos[codigo])
      console.log(`Moneda ${codigo} tasa: ${valoresCriptos[codigo]}`);
    }

  })
  console.log("Datos Actualizados en los divs")
}
actualizarDivs();

function convertir(){
  const monto = parseFloat(document.getElementById("monto").value);// toma en cuenta el valor del monto y usa .value para obtener el valor, sin ella no hace nada.

  if (isNaN(monto) || monto <= 0){
    console.error("Ingresa un monto Valido");
    return;
  }

  const monedaSeleccionada = document.querySelector(".selected-moneda").getAttribute("data-value"); // variable que tome el span de la seleccion de la moneda, usamos innerText porque manipulamos un span
  const critoSeleccionada  = document.querySelector(".selected").getAttribute("data-value");// mismo caso de aca pero tomamos en cuenta el span de la seleccion de las criptos
  
  //console.log(critoSeleccionada);
  //console.log(monedaSeleccionada);

  const monedaDiv = document.querySelector(`.option_moneda[data-value="${monedaSeleccionada}"]`); // aqui toma en cuenta el codigo de la moneda
  const criptoDiv = document.querySelector(`.option[data-value="${critoSeleccionada}"]`);

 
  console.log("monedaDiv", monedaDiv);
  console.log("criptoDiv", criptoDiv);

  //console.log(`cripto seleccionada:${critoSeleccionada}`);
  //console.log(`Buscando: .option[data-value="${critoSeleccionada}"]`);
 
  const tasaCripto = parseFloat(criptoDiv.getAttribute("data-rate")); 
  const tasaMoneda = parseFloat(monedaDiv.getAttribute("data-rate"));

  console.log(`MAMAGUEVO ${critoSeleccionada} -> tasa: ${tasaCripto}`);
  console.log(`Moneda: ${monedaSeleccionada} -> tasa: ${tasaMoneda}`);

  if (!criptoDiv || !monedaDiv){
    document.getElementById("resultado").textContent = `Selecciona una criptomoneda`
    return;
  }
  //console.log("Tasa de la cripto:", tasaCripto);
  //console.log("Tasa de la moneda:", tasaMoneda);

 
  
 
  if (!(tasaCripto) || !(tasaMoneda)){ // si no estan 
    document.getElementById("resultado").textContent = `Selecciona una criptomoneda`
    console.error("Nose encontraron las tasas de cambio");
    return;
  }

  

  
  const montoFinal = monto * tasaCripto * tasaMoneda;

  console.log(`conversion: ${montoFinal.toFixed(2)} ${monedaSeleccionada}`);
  console.log("tasa de la cripto monedas:", tasaCripto);
  console.log("tasa de las  monedas:",tasaMoneda);
  document.getElementById("resultado").textContent = ` ${monto} ${critoSeleccionada} Son: ${montoFinal.toLocaleString(`de-DE`, { minimumFractionDigits: 2, maximumFractionDigits: 2})} ${monedaSeleccionada}`;


  //console.log("Tasa cripto:", criptoDiv);
  //console.log(`Conversión: ${montoFinal.toFixed(2)} ${monedaSeleccionada}`);

}
