<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import axios from "axios";
    import { page } from "$app/stores";
    import "flag-icons/css/flag-icons.min.css";
    import { whereAlpha2 } from 'iso-3166-1';
    let slug;
    $: slug = $page.params.slug;
    let escultor = {}; // Objeto vacío para los datos del escultor
    let data = {};
    let obras = []; // Cambié a un array para manejar varias obras
    let mostrandoCarga = true;
    let animate = false; // Control de animación
    let nombrepais;
    async function fetchEscultor(slug) {
        mostrandoCarga = true;
        try {
            const response = await axios.get(`http://localhost:3001/api/escultores/${slug}`, {
                params: { nombre: slug }
            });
            data = response.data;
            escultor = data.escultor;
            obras = data.obras;
            
            nombrepais = whereAlpha2(escultor.nacionalidad); 
            nombrepais=nombrepais.country;
        } catch (error) {
            console.log("Error al obtener escultor:", error);
        }
        mostrandoCarga = false;
        // Activa la animación
        animate = false; // Reinicia la animación
        // Usa setTimeout para permitir el reflow y luego activar la animación
        setTimeout(() => {
          animate = true; // Activa la animación
        }, 0);
    }
  
    onMount(() => {
      fetchEscultor(slug);
    });
  </script>

<!-- Mostrar el ícono de carga solo cuando mostrandoCarga es true -->
{#if mostrandoCarga}
    <div class="loading-icon"></div>
{/if}

{#if !mostrandoCarga}
  <article class="escultor-detail-container max-w-2xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg animate">
      <header class="text-center">
          <img src={escultor.escultorFoto} alt="{escultor.escultorName}" class="w-32 h-32 rounded-full mx-auto" />
          <h1 class="text-3xl font-bold mt-4">{escultor.escultorName} <span class={`fi fi-${escultor.nacionalidad}`}></span></h1>
      </header>

      <section class="mt-4">
          <h2 class="text-xl font-semibold">Biografía</h2>
          <p>Nacionalidad: {nombrepais} </p>
          <p>{escultor.content}</p>
      </section>

      <section class="mt-4">
          <h2 class="text-xl font-semibold">Contacto</h2>
          <p>Email: <a href="mailto:{escultor.contactoEmail}" class="text-blue-600 hover:underline">{escultor.contactoEmail}</a></p>
      </section>
  </article>
{/if}

<!-- Contenedor de las cards -->
<div class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4 auto-rows-auto {animate ? 'animate' : ''}">
    {#each obras as card}
        <div class="card block bg-white shadow-secondary-1 m-2.5 border-2 border-gray-300 rounded-md">
            <div class="relative overflow-hidden bg-cover bg-no-repeat">
                <!-- Contenedor con scroll horizontal para las imágenes -->
                <div class="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsla(0,0%,98%,0.15)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100"></div>
            </div>
            <a href={`/obras/${card.obraPantalla}`}>
                <div class="scroll-container">
                    {#each card.obraImage as image}
                        <div class="scroll-item">
                            <img class="scroll-image rounded-t-lg" src={image} alt={card.title} />
                        </div>
                    {/each}
                </div>
                <div class="p-6 text-surface dark:text-white">
                    <h5 class="mb-2 text-xl font-medium leading-tight text-black">{card.obraName}</h5>
                    <p class="mb-4 text-base text-left text-black">{card.content}</p>
                    <p class="text-gray-600 text-sm">Fecha de creación: {card.f_creacion}</p>
                    <!-- Aquí se agrega el puntaje con estrellas, incluyendo medias estrellas -->
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
            </a>
        </div>
    {/each}
</div>

<style>

    .scroll-container {
        display: flex;
        overflow-x: scroll;
        scroll-snap-type: x mandatory; /* Habilita el deslizamiento en incrementos fijos */
        width: 100%; /* Ancho del contenedor */
        scroll-behavior: smooth;
    }

    .scroll-item {
        flex: 0 0 100%; /* Cada elemento ocupa el 100% del ancho del contenedor */
        scroll-snap-align: start; /* Define dónde se "ajusta" el desplazamiento */
        padding: 00px;
        text-align: center;
        background-color: #f1f1f1;
        border: 0px solid #ccc;
    }
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(100px); /* Mueve hacia abajo 30 píxeles */
        }
        to {
            opacity: 1;
            transform: translateY(0); /* Regresa a su posición original */
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

    .grid.animate > .card {
        animation: fadeIn 0.5s ease forwards; /* Animación de desvanecimiento */
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

    /* Estilos generales */
    .escultor-detail-container {
      background-color: #f9f9f9;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    }
  
    /* Animación de entrada */
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(100px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  
    .animate {
      animation: fadeIn 0.5s ease-in-out forwards;
    }
  
    h1 {
      font-family: 'Arial', sans-serif;
      color: #713307;
    }
  
    /* Títulos y texto */
    h2 {
      color: #86512c;
      font-weight: bold;
    }
  
    p {
      color: #4a4a4a;
      font-size: 1rem;
      line-height: 1.6;
      margin-top: 10px;
    }
  
    /* Enlaces */
    a {
      color: #713307;
    }
  
    a:hover {
      text-decoration: underline;
      color: #86512c;
    }
    
  </style>