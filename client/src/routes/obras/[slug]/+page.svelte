<script>
  // @ts-nocheck
  import { onMount } from "svelte";
  import axios from "axios";
  import { page } from "$app/stores";
  import QRCode from "qrcode";
  import CryptoJS from "crypto-js"; // Importar la librería
  import "@fortawesome/fontawesome-free/css/all.min.css";

  let qrCodeUrl = "";
  let qrCodeData = "";
  let mostrarQR = false;
  let userRole = null;
  let nombreusu = "";
  let mensajeCopiado = false;

  let slug;
  let nombreObra = "";
  let mostrandoCarga = true;
  let animate = false; // Control de animación

  let artistas = [];
  let eventos = [];

  $: slug = $page.params.slug;

  let obra = {}; // Objeto vacío para los datos de la obra
  let obraUrl = `http://localhost:3001/api/obras/${obra.slug}`;

  function decodificarToken(token) {
    try {
      const payload = token.split(".")[1]; // Extraemos el payload del JWT (parte del medio)
      const decoded = atob(payload); // Decodificamos la base64
      return JSON.parse(decoded); // Convertimos el JSON
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  }
  async function fetchObra(slug) {
    mostrandoCarga = true;
    console.log("Buscando obra con slug:", slug); // Verifica el slug antes de la petición
    nombreObra = slug;
    try {
      const response = await axios.get(
        `http://localhost:3001/api/obras/${slug}`,
        {
          // Cambia la ruta a '/api/obras'
          params: { nombre: slug },
        }
      );
      console.log("Datos de la obra recibidos:", response.data); // Verifica los datos que se reciben
      obra = response.data.cardsEscultura;
      artistas = response.data.cardsArtistas;
      eventos = response.data.cardsEventos;
      if (obra.obraEscultor.escultoresNombre.includes(nombreusu)) {
        mostrarQR = true;
        generateQRCode();
        setInterval(generateQRCode, 60000); // 60000 ms = 1 minuto
      } else {
        mostrarQR = false;
      }
      // Reinicia y activa la animación para las nuevas tarjetas
      animate = false;
      setTimeout(() => {
        animate = true;
      }, 0);
    } catch (error) {
      console.log("Error al obtener la obra:", error);
    }
    mostrandoCarga = false;
  }

  async function generateQRCode() {
    // Generar un token único que cambia cada minuto
    const timestamp = Math.floor(Date.now() / 60000); // Cada minuto cambia
    const hashURL = import.meta.env.VITE_HASH_URLS;
    // Concatenar con la clave secreta y hashear
    const hash = CryptoJS.SHA256(
      `${nombreObra}-${timestamp}-${hashURL}`
    ).toString(CryptoJS.enc.Base64);
    console.log(nombreObra);
    console.log(timestamp);
    console.log(hashURL);
    // Tomar los primeros 8 caracteres del hash
    const hashedSlug = hash.substring(0, 8);

    const url = `http://localhost:3333/votacion?slug=${nombreObra}-${hashedSlug}`;

    // Generar el código QR
    qrCodeUrl = url;
    console.log(qrCodeUrl);
    qrCodeData = await QRCode.toDataURL(url);
  }

  function generarEnlacesCompartir() {
    const urlPagina = `http://localhost:3001/api/obras/${slug}`; // Obtiene la URL actual de la página
    const mensaje = "¡Mira esta obra!"; // Mensaje predeterminado para compartir
    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        urlPagina
      )}&quote=${encodeURIComponent(mensaje)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(urlPagina)}&text=${mensaje}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(mensaje +'\n'+ urlPagina)}`,
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
    let token = localStorage.getItem("token");
    let userRole = localStorage.getItem("role");
    if (token) {
      let decoded = decodificarToken(token);
      nombreusu = decoded.nombre;
    }
    fetchObra(slug);
  });

  //   // Actualizar el QR cada minuto
</script>

<!-- Mostrar el ícono de carga solo cuando mostrandoCarga es true -->
{#if mostrandoCarga}
  <div class="loading-icon"></div>
{/if}

{#if !mostrandoCarga}
  <!-- Renderizado de la página de detalle de la obra -->
  <article
    class="obra-detail-container max-w-2xl mx-auto mt-8 p-6 bg-white shadow-md rounded-lg"
  >
    <header class="text-center">
      <h1 class="text-3xl font-bold mt-4">{obra.obraName}</h1>
    </header>
    <section class="mt-4">
      <h2 class="text-xl font-semibold">Técnica</h2>
      <p>{obra.content}</p>
      <!-- Muestra la técnica de la obra -->
    </section>
    <section class="mt-4">
      <h2 class="text-xl font-semibold">Antecedente</h2>
      {#if obra.antecedente == 1}
        <p>Si</p>
      {:else}
        <p>No</p>
      {/if}
      <!-- Muestra el antecedente de la obra -->
    </section>
    {#if mostrarQR}
      <section class="mt-2">
        <img src={qrCodeData} alt="QR" />
        <!-- Muestra el antecedente de la obra -->
      </section>
    {:else}
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
    {/if}
  </article>

  <div class="contenedor">
    <div class="galeria">
      {#each obra.obraImage as imagen}
        <img src={imagen} alt="Imagen" class="imagen" />
      {/each}
    </div>
  </div>

  <!-- Contenedor principal centrado -->
  <div class="flex justify-center items-start py-8 bg-gray-50">
    <!-- Contenedor de los artistas con un max-width grande -->
    <div class="w-full max-w-6xl">
      <h1 class="text-3xl font-bold mt-4 text-center">
        Artistas que realizaron la obra
      </h1>
      <div
        class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4 auto-rows-auto justify-items-center"
      >
        {#each artistas as card}
          <div
            class="block rounded-lg bg-white shadow-secondary-1 m-2.5 border-2 border-gray-300 rounded-md {animate
              ? 'animate'
              : ''}"
          >
            <div class="relative overflow-hidden bg-cover bg-no-repeat">
              <a
                href={`/escultores/${encodeURIComponent(card.escultorPantalla)}`}
              >
                <img
                  src={card.escultorFoto}
                  class="w-40 rounded-full mx-auto pt-2"
                  alt="Avatar"
                />
                <div
                  class="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsla(0,0%,98%,0.15)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100"
                ></div>
              </a>
            </div>
            <div class="p-6 text-surface dark:text-white">
              <h5 class="mb-2 text-xl font-medium leading-tight text-black">
                {card.escultorName}
              </h5>
              <p class="mb-4 text-base text-left text-black">{card.content}</p>
              <p class="text-sm text-left text-gray-600">
                Contacto: <a
                  href="mailto:{card.contactoEmail}"
                  class="text-blue-600 hover:underline">{card.contactoEmail}</a
                >
              </p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- Contenedor principal centrado -->
  <div class="flex justify-center items-start py-8 bg-gray-100">
    <!-- Contenedor de los eventos -->
    <div class="w-full max-w-6xl">
      <!-- Aumenté el max-w de 4xl a 6xl -->
      <h1 class="text-3xl font-bold mt-4 text-center">
        Eventos en el que participa la obra
      </h1>
      <div
        class="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4 auto-rows-auto"
      >
        {#each eventos as card}
          <div
            class="card block rounded-lg bg-white shadow-secondary-1 m-2.5 border-2 border-gray-300 rounded-md {animate
              ? 'animate'
              : ''}"
          >
            <div class="relative overflow-hidden bg-cover bg-no-repeat">
              <a
                href={`/eventos/${card.eventoPantalla}`}
                class="hover:underline"
              >
                <div
                  class="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsla(0,0%,98%,0.15)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100"
                ></div>
              </a>
              <div class="p-6 text-surface dark:text-white">
                <h5 class="mb-2 text-xl font-medium leading-tight text-black">
                  {card.eventName}
                </h5>
                <span class="text-cyan-900"
                  >{card.eventStartDate} - {card.eventFinishDate}</span
                ><br />
                <span class="text-cyan-900"
                  >De {card.startTime} a {card.finishTime}</span
                ><br />
                <span class="text-cyan-900">Lugar: {card.location}</span>
                <p class="mb-4 text-base text-left text-black">
                  {card.content}
                </p>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
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
  /* Centrar todo el contenedor en la pantalla */
  .contenedor {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 20px; /* Padding superior adicional */
  }

  /* Contenedor de las imágenes, con flexbox */
  .galeria {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: center; /* Centrar las imágenes */
  }

  /* Estilo de las imágenes */
  .imagen {
    width: 100%;
    max-width: 300px; /* Ancho máximo para que las imágenes sean responsivas */
    height: auto; /* Mantener la relación de aspecto */
    object-fit: cover;
    border-radius: 8px;
  }

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
    animation: fadeIn 0.5s ease forwards;
  }
  /* Personaliza los estilos para la página de detalle de cada obra */
  .obra-detail-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
    max-width: 900px;
  }
  .max-w-2xl {
    max-width: 768px;
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
