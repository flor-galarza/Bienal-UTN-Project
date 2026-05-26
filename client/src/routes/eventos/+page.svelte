<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import axios from "axios";
    import AOS from 'aos';
    import 'aos/dist/aos.css'

    let searchQuery = ""; // Valor de la búsqueda
    let criterio = 'promedio'; // Criterio de orden por defecto
    let orden = 'DESC'; // Orden por defecto

    /**
     * @type {any[]}
     */
    let cards = [];
    let animate = false; // Control de animación
    let currentPage = 1; // Página actual
    let itemsPerPage = 20; // Cantidad de cartas por página
    let totalPages = 0; // Total de páginas
    /**
     * @type {{ eventName: any; }}
     */
    let obraReciente;
    let mostrandoCarga = true; // Control de carga

    async function fetchEventos(query = "", criterio = 'promedio', orden = 'DESC') {
        mostrandoCarga = true;
        try {
            const res = await axios.get(`http://localhost:3001/api/eventos`, {
                params: {
                    search: query,     // Parámetro de búsqueda
                    sortBy: criterio,  // Criterio de ordenación (nombre, f_creacion, promedio)
                    order: orden       // Orden (asc o desc)
                }
            });
            cards = res.data;
            console.log(cards);

            const resObraReciente = await axios.get(`http://localhost:3001/api/eventoProximo`);
            obraReciente = resObraReciente.data[0];

            currentPage = 1;
            // Calcula el total de páginas
            totalPages = Math.ceil(cards.length / itemsPerPage);

            // Activa la animación
            animate = false; // Reinicia la animación
            setTimeout(() => {
                animate = true; // Activa la animación
            }, 0);
        } catch (error) {
            console.log(error);
        }
        AOS.init()
        mostrandoCarga = false;
    }

    // Ejecutar la consulta inicial cuando se monta la página
    onMount(() => {
        fetchEventos(); // Sin query al principio
        console.log("montando")
    });
    
    // Calcula las cartas a mostrar en la página actual
    $: displayedCards = cards.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Cambia de página
    /**
     * @param {number} page
     */
    function changePage(page) {
        currentPage = page; // Cambia la página actual
        window.scrollTo(0, 0); // Desplaza hacia arriba
        animate = false; // Reinicia la animación
        setTimeout(() => {
            animate = true; // Activa la animación
        }, 0);
    }
</script>

<div class="main-container" style="background-image: url('fondobienal2024_2.jpg');">

<!-- Mostrar el ícono de carga solo cuando mostrandoCarga es true -->   
{#if mostrandoCarga}
    <div class="loading-icon"></div>
    {:else}
        {#if obraReciente}
        <article
            data-aos="fade-down"
            data-aos-duration="400"
            class="max-w-full mx-auto mt-8 p-6 bg-white shadow-md rounded-lg text-center">
                <section class="mt-4">
                    <h1 class="text-4xl font-bold">
                        <u>Evento próximo:</u>
                    </h1>
                    <h2 class="text-3xl font-semibold">{obraReciente.eventName}</h2>
                    <h3 class="text-xl font-semibold">Detalles del Evento</h3>
                    <div class="grid grid-cols-2 gap-4 mt-4">
                        <!-- Primera columna -->
                        <p class="text-right"><strong>Fecha de inicio:</strong> {obraReciente.eventStartDate}</p>
                        <p class="text-left"><strong>Fecha de fin:</strong> {obraReciente.eventFinishDate}</p>
                        <!-- Segunda columna -->
                        <p class="text-right"><strong>Hora:</strong> {obraReciente.startTime} - {obraReciente.finishTime}</p>
                        <p class="text-left"><strong>Ubicación:</strong> {obraReciente.location}</p>
                    </div>
                    <p class="mt-4">{obraReciente.content}</p>
                </section>
            </article>
        {/if}
        <div class="search-container">
            <div>
                <input
                    type="text"
                    class="search-input"
                    bind:value="{searchQuery}"
                    placeholder="Buscar evento..."
                />
            </div>
            <div>
                <!-- Lista desplegable para el criterio de orden -->
                <select class="search-select" bind:value="{criterio}">
                    <option value="promedio">Mejores eventos</option>
                    <option value="nombre">Nombre</option>
                    <option value="fecha_inicio">Fecha de inicio</option>
                </select>
                <!-- Lista desplegable para el orden ascendente/descendente -->
                <select class="search-select" bind:value="{orden}">
                    <option value="DESC">Descendente</option>
                    <option value="ASC">Ascendente</option>
                </select>
                <button class="search-button" on:click="{() => fetchEventos(searchQuery, criterio, orden)}">Buscar</button>
            </div>
        </div>
        <!-- Contenedor de las cards -->
        <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4 auto-rows-auto {animate ? 'animate' : ''}">
            {#each displayedCards as card}
                <div class="card block rounded-lg bg-white shadow-secondary-1 m-2.5 border-2 border-gray-300 rounded-md" class:animate={animate}>
                    <div class="relative overflow-hidden bg-cover bg-no-repeat">
                        <a href={`/eventos/${card.eventoPantalla}`} class="hover:underline">
                        <div class="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsla(0,0%,98%,0.15)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100"></div>
                        </a>
                        <div class="p-6 text-surface dark:text-white">
                            <h5 class="mb-2 text-xl font-medium leading-tight text-black">{card.eventName}</h5>
                            <span class="text-cyan-900">{card.eventStartDate} - {card.eventFinishDate}</span><br>
                            <span class="text-cyan-900">De {card.startTime} a {card.finishTime}</span><br>
                            <span class="text-cyan-900">Lugar: {card.location}</span>
                            <p class="mb-4 text-base text-left text-black">{card.content}</p>
                            <!-- Mostrar el estado con colores dinámicos -->
                            <span class="{card.estado === 'Terminado' ? 'text-black' : card.estado === 'En curso' ? 'text-blue-600' : 'text-gray-500'}">
                                {card.estado}
                            </span><br>
                            <div class="stars">
                                {#each Array(5) as _, index}
                                    {#if index < Math.floor(card.promedio)} <!-- Estrella completa -->
                                        <span class="star filled">★</span>
                                    {:else if index < card.promedio} <!-- Media estrella -->
                                        <span class="star half-filled">★</span>
                                    {:else} <!-- Estrella vacía -->
                                        <span class="star">★</span>
                                    {/if}
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
        <!-- Controles de paginación -->
        <div class="pagination">
            {#each Array(totalPages) as _, index}
                <button class="page-button" on:click="{() => changePage(index + 1)}">
                    {index + 1}
                </button>
            {/each}
        </div>
    {/if}
</div>
<style>
    .stars {
        margin-top: 8px; /* Espaciado superior */
    }

    .star {
        font-size: 20px; /* Tamaño de las estrellas */
        color: lightgray; /* Color por defecto de las estrellas */
        margin-right: 2px; /* Espaciado entre las estrellas */
        transition: color 0.3s; /* Transición para el color */
    }

    .star.filled {
        color: gold; /* Color de las estrellas llenas */
    }

    .star.half-filled {
        background: linear-gradient(90deg, gold 50%, lightgray 50%); /* Gradiente para media estrella */
        background-clip: text;
        -webkit-background-clip: text; /* Clip para texto en navegadores WebKit */
        color: transparent; /* Oculta el color base */
        display: inline-block; /* Necesario para el fondo */
        width: 20px; /* Ancho para media estrella */
        text-align: center; /* Centra el texto */
    }
    /* Estilos para el ícono de carga */
    .loading-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 50px;
        height: 50px;
        border: 6px solid #f3f3f3;
        border-top: 6px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        z-index: 1000;
    }

    /* Animación de giro */
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(100px); /* Mueve hacia abajo 100 píxeles */
        }
        to {
            opacity: 1;
            transform: translateY(0); /* Regresa a su posición original */
        }
    }

    .card.animate {
        animation: fadeIn 0.5s ease forwards; /* Animación de desvanecimiento */
    }

    .search-container {
        display: flex;
        flex-wrap: wrap; /* Permite que los elementos se ajusten a varias líneas */
        gap: 10px; /* Espaciado entre los elementos */
        justify-content: center; /* Centra horizontalmente */
        align-items: center; /* Centra verticalmente */
        margin-top: 20px;
        width: 100%; /* Ancho completo */
    }

    .search-input {
        padding: 10px; /* Espaciado interno */
        border: 2px solid #ccc; /* Color y grosor del borde */
        border-radius: 5px; /* Esquinas redondeadas */
        margin-right: 10px; /* Espaciado entre el input y el botón */
        font-size: 16px; /* Tamaño de la fuente */
        width: 250px; /* Ancho del input */
        transition: border-color 0.3s; /* Transición para el color del borde */
    }

    .search-input:focus {
        border-color: #000000; /* Cambia el color del borde al hacer foco */
        outline: none; /* Elimina el contorno por defecto */
        }

    /* Botones de búsqueda */
    .search-button, .search-select {
        padding: 10px;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s, border-color 0.3s;
    }

.search-button {
  background-color: #000000;
  color: white;
  border: none;
}

.search-button:hover {
  background-color: #525252;
}

.search-select {
  background-color: #f4f4f4;
  border: 2px solid #ccc;
}

.search-select:hover,
.search-select:focus {
  border-color: #86512c;
}
    
/* Botones y selects en pantallas pequeñas */
@media (max-width: 768px) {
  .search-container {
    display: flex;
    justify-content: center; /* Centra los elementos horizontalmente */
    align-items: center; /* Centra los elementos verticalmente */
    gap: 10px; /* Espaciado uniforme entre elementos */
    flex-wrap: wrap; /* Permite que los elementos se ajusten si no hay espacio suficiente */
    margin-top: 00px; /* Espaciado superior opcional */
    padding: 10px; /* Añade espacio interior opcional */
    }   

    .search-container > div {
        display: flex;
        justify-content: center; /* Centra los elementos dentro de cada div */
        align-items: center; /* Alinea los elementos verticalmente */
        flex-wrap: wrap; /* Permite ajustar el contenido interno si es necesario */
        gap: 10px; /* Espaciado interno entre elementos */  
    }   

    .search-input{
        width: 300px; /* Ocupa todo el ancho del contenedor */
        font-size: 14px; /* Reduce el tamaño de fuente */
        flex-wrap: nowrap; /* Evita que los elementos se apilen */
        padding: 8px; /* Reduce el padding */

    }

   .search-select, .search-button {
    flex: 1 0 auto; /* Los elementos mantienen su tamaño ajustado al contenido */
    max-width: 150px; /* Limita el ancho máximo */
    font-size: 14px; /* Reduce el tamaño de fuente */
    padding: 8px; /* Reduce el padding */
  } 
}

    .stars {
        margin-top: 8px; /* Espaciado superior */
    }

    .star {
        font-size: 20px; /* Tamaño de las estrellas */
        color: lightgray; /* Color por defecto de las estrellas */
        margin-right: 2px; /* Espaciado entre las estrellas */
        transition: color 0.3s; /* Transición para el color */
    }

    .star.filled {
        color: gold; /* Color de las estrellas llenas */
    }

    .star.half-filled {
        background: linear-gradient(90deg, gold 50%, lightgray 50%); /* Gradiente para media estrella */
        background-clip: text;
        -webkit-background-clip: text; /* Clip para texto en navegadores WebKit */
        color: transparent; /* Oculta el color base */
        display: inline-block; /* Necesario para el fondo */
        width: 20px; /* Ancho para media estrella */
        text-align: center; /* Centra el texto */
    }

    .pagination {
        display: flex;
        justify-content: center; /* Centra horizontalmente */
        margin-top: 20px; /* Espaciado superior */
    }

    .page-button {
        padding: 5px 10px; /* Espaciado interno */
        border: 1px solid #ccc; /* Color y grosor del borde */
        border-radius: 5px; /* Esquinas redondeadas */
        margin: 0 5px; /* Espaciado entre botones */
        cursor: pointer; /* Cambia el cursor al pasar el mouse */
        background-color: #f4f4f4; /* Color de fondo */
        transition: background-color 0.3s; /* Transición para el color de fondo */
    }

    .page-button:hover {
        background-color: #d1d1d1; /* Color de fondo al pasar el mouse */
    }
</style>

