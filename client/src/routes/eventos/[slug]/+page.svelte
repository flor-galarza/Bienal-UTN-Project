<script>
  // @ts-nocheck
  import { onMount } from "svelte";
  import axios from "axios";
  import { page } from "$app/stores";
  import AOS from "aos";
  import "aos/dist/aos.css";
  let slug;
  $: slug = $page.params.slug;
  let evento = {}; // Objeto vacío para los datos del evento
  let data = {};
  let obras = []; // Cambié a un array para manejar varias obras
  let animate = false;
  let mostrandoCarga = true;
  let mensajeCopiado = false;

  async function fetchEvento(slug) {
    mostrandoCarga = true;
    try {
      const res = await axios.get(`http://localhost:3001/api/eventos/${slug}`, {
        params: { nombre: slug },
      });
      data = res.data;
      evento = data.evento;
      obras = data.obras; // Asigno las obras correctamente
    } catch (error) {
      console.log("Error al obtener el evento:", error);
    }
    AOS.init();
    mostrandoCarga = false;
    // Activa la animación
    animate = false; // Reinicia la animación
    // Usa setTimeout para permitir el reflow y luego activar la animación
    setTimeout(() => {
      animate = true; // Activa la animación
    }, 0);
  }

  function generarEnlacesCompartir() {
    const urlPagina = `http://localhost:3001/api/eventos/${slug}`; // Obtiene la URL actual de la página
    const mensaje = "¡Mira esta obra!"; // Mensaje predeterminado para compartir
    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        urlPagina
      )}&quote=${encodeURIComponent(mensaje)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(urlPagina)}&text=¡Echa_un_vistazo_a_esta_obra!`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent("¡Mira esta obra! " + urlPagina)}`,
      instagram: `https://www.instagram.com`, // Sin soporte directo
    };
  }

  function copiarAlPortapapeles() {
    const urlPagina = window.location.href; // Obtiene la URL actual de la página
    navigator.clipboard
      .writeText(urlPagina)
      .then(() => {
        mensajeCopiado = true;
        setTimeout(() => (mensajeCopiado = false), 2000); // Ocultar mensaje tras 2 segundos
      })
      .catch((err) => {
        console.error("Error al copiar al portapapeles:", err);
      });
  }
  onMount(() => {
    fetchEvento(slug);
  });
</script>

<!-- Renderizado de la página de detalle del evento -->
{#if !mostrandoCarga}
  <article
    data-aos="fade-down"
    data-aos-duration="1000"
    class="max-w-full mx-auto mt-8 p-6 bg-white shadow-md rounded-lg text-center"
  >
    <header>
      <h1 class="text-3xl font-bold mt-4">{evento.eventName}</h1>
    </header>
    <section class="mt-4">
      <h2 class="text-xl font-semibold">Detalles del Evento</h2>
      <p><strong>Fecha de inicio:</strong> {evento.eventStartDate}</p>
      <p><strong>Fecha de fin:</strong> {evento.eventFinishDate}</p>
      <p><strong>Hora:</strong> {evento.startTime} - {evento.finishTime}</p>
      <p><strong>Ubicación:</strong> {evento.location}</p>
      <p class="mt-4">{evento.content}</p>
    </section>
    <!-- Botones para compartir en redes sociales -->
      <section class="share-icons">
        <!-- Facebook -->

        <a
          href={generarEnlacesCompartir().facebook}
          target="_blank"
          aria-label="Compartir en Facebook"
          rel="noopener noreferrer"
          class="icon-button facebook"
        >
          <i class="fab fa-facebook-f"></i>
        </a>

        <!-- Twitter -->
        <a
          href={generarEnlacesCompartir().twitter}
          target="_blank"
          aria-label="Compartir en Twitter"
          rel="noopener noreferrer"
          class="icon-button twitter"
        >
          <i class="fab fa-twitter"></i>
        </a>

        <!-- WhatsApp -->
        <a
          href={generarEnlacesCompartir().whatsapp}
          target="_blank"
          aria-label="Compartir en WhatsApp"
          rel="noopener noreferrer"
          class="icon-button whatsapp"
        >
          <i class="fab fa-whatsapp"></i>
        </a>

        <!-- Copiar enlace -->
        <!-- Contenedor del botón con posición relativa -->
        <div class="relative">
          <!-- Botón de copiar -->
          <button
            class="icon-button copy"
            aria-label="Copiar enlace"
            on:click={() => copiarAlPortapapeles(window.location.href)}
          >
            <i class="fas fa-copy"></i>
          </button>
          {#if mensajeCopiado}
            <!-- Mensaje copiado -->
            <span class="mensaje-copiado">Copiado!</span>
          {/if}
        </div>
      </section>
  </article>
{/if}

<!-- Mostrar el ícono de carga solo cuando mostrandoCarga es true -->
{#if mostrandoCarga}
  <div class="loading-icon"></div>
{:else}
<section class="obras-section p-4">
  <!-- Contenedor de las cards -->
  <h2 class="text-2xl font-semibold text-center mb-6">Obras del evento</h2>
  <div
    class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4 auto-rows-auto {animate
      ? 'animate'
      : ''}"
  >
    {#each obras as card}
      <div
        class="card block bg-white shadow-secondary-1 m-2.5 border-2 border-gray-300 rounded-md"
      >
        <div class="relative overflow-hidden bg-cover bg-no-repeat">
          <!-- Contenedor con scroll horizontal para las imágenes -->
          <div
            class="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsla(0,0%,98%,0.15)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100"
          ></div>
        </div>
        <a href={`/obras/${card.obraPantalla}`}>
          <div class="scroll-container">
            {#each card.obraImage as image}
              <div class="scroll-item">
                <img
                  class="scroll-image rounded-t-lg"
                  src={image}
                  alt={card.title}
                />
              </div>
            {/each}
          </div>
          <div class="p-6 text-surface dark:text-white">
            <h5 class="mb-2 text-xl font-medium leading-tight text-black">
              {card.obraName}
            </h5>
            <span class="text-cyan-900">
              <div class="flex items-center space-x-2">
                {#each card.obraEscultor.escultoresNombre.slice(0, 4) as nombre, index}
                  <div class="escultor-item">
                    {#if index === 0}
                      <!-- Imagen grande con nombre para el primer escultor -->
                      <img
                        src={card.obraEscultor.escultoresFotos[index]}
                        class="w-32 h-32 rounded-full object-cover"
                        alt="Avatar"
                      />
                      <h2>{nombre}</h2>
                    {:else}
                      <!-- Imágenes pequeñas sin nombre para el resto -->
                      <img
                        src={card.obraEscultor.escultoresFotos[index]}
                        class="w-16 h-16 rounded-full object-cover"
                        alt="Avatar"
                      />
                    {/if}
                  </div>
                {/each}
              </div>
            </span>
            <p class="mb-4 text-base text-left text-black">{card.content}</p>
            <p class="text-gray-600 text-sm">
              Fecha de creación: {card.f_creacion}
            </p>
            <!-- Aquí se agrega el puntaje con estrellas, incluyendo medias estrellas -->
            <div class="stars">
              {#each Array(5) as _, index}
                {#if index < Math.floor(card.promedio)}
                  <!-- Estrella completa -->
                  <span class="star filled">★</span>
                {:else if index < card.promedio}
                  <!-- Media estrella -->
                  <span class="star half-filled">★</span>
                {:else}
                  <!-- Estrella vacía -->
                  <span class="star">★</span>
                {/if}
              {/each}
            </div>
          </div>
        </a>
      </div>
    {/each}
  </div>
</section>
{/if}

<style>
  .mensaje-copiado {
    position: absolute;
    bottom: -20px; /* Aparece debajo del icono */
    right: 0; /* Pegado al lado derecho del botón */
    background-color: #000;
    color: #fff;
    padding: 4px 8px; /* Compacto */
    border-radius: 3px;
    font-size: 12px; /* Tamaño pequeño */
    white-space: nowrap; /* Sin saltos de línea */
    z-index: 10;
    opacity: 0.9;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3); /* Un toque de sombra */
  }
  .icon-button.copy {
    position: relative; /* Necesario para el mensaje */
  }

  .share-icons {
    display: flex;
    justify-content: flex-end;
    gap: 15px;
    margin-top: 20px;
  }

  .icon-button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #f1f1f1;
    text-decoration: none;
    color: #000;
    font-size: 20px;
    transition: background-color 0.3s ease;
  }

  .icon-button:hover {
    background-color: #e0e0e0;
  }

  .facebook {
    color: #4267b2;
  }

  .twitter {
    color: #1da1f2;
  }

  .copy {
    color: #333;
  }

  .obras-section h2 {
    text-align: center;
    margin-bottom: 20px;
  }
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
    background: linear-gradient(
      90deg,
      gold 50%,
      lightgray 50%
    ); /* Gradiente para media estrella */
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
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
