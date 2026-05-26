<script>
    import { onMount } from 'svelte';
    import axios from 'axios';
    import HoverCard from './shape.svelte';
    let videoSource = "B24-web-slide-institucional-nuevo-c.mp4";

    /**
     * @type {any[]}
     */
    let cards = [];

    async function fetchObras() {
        try {
            const res = await axios.get(`http://localhost:3001/api/esculturas`, {
                params: {
                    search: "",    
                    sortBy:  'promedio',  
                    order: 'DESC'      
                }
            });
            cards = res.data.slice(0,10);
            console.log(cards)
        } catch (error) {
            console.log(error);
        }
    }

    // Ejecutar la consulta inicial cuando se monta la página
    onMount(() => {
        fetchObras(); // Sin query al principio
    });

</script>

<style>
  .video-container {
    position: relative;
    width: 100%;
    max-width: 1920px;
    margin: 0 auto;
    overflow: hidden;
    border-radius: 12px;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
    transition: transform 0.5s ease, box-shadow 0.5s ease;
  }

  .video-container:hover {
    transform: scale(1.02);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  }

  .video-container video {
    width: 100%;
    height: auto;
    filter: brightness(0.9) saturate(1.2) contrast(1.1) sepia(0.1);
    transition: filter 0.5s ease;
  }

  .video-container:hover video {
    filter: brightness(1.1) saturate(1.5) contrast(1.3) hue-rotate(15deg);
    animation: hueShift 5s infinite linear;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between; /* Asegura que las tarjetas no se solapen con el video */
    align-items: flex-start;
    padding: 1.5rem;
    font-family: 'Montserrat', sans-serif;
  }

  .card-section {
    display: flex;
    flex-direction: column;
    max-width: 40%; /* Limita el ancho total de las tarjetas */
    padding-right: 1rem;
  }

  .section-title {
    font-size: 1.8rem;
    font-weight: bold;
    color: white;
    margin-bottom: 1rem;
    text-align: center;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
  }

  .card-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr); /* 4 columnas por fila */
    grid-gap: 1rem; /* Espaciado entre tarjetas */
  }

  .hover-card {
    max-width: 100%;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    background: rgba(255, 255, 255, 0.8); /* Fondo semitransparente */
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    padding: 0.5rem;
    text-align: center; /* Centra el texto en cada tarjeta */
  }

  .hover-card:hover {
    transform: scale(1.1);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  }

  @keyframes hueShift {
    0% {
      filter: hue-rotate(0deg);
    }
    100% {
      filter: hue-rotate(360deg);
    }
  }
</style>

<div class="video-container">
  <video autoplay muted loop playsinline>
    <source src={videoSource} type="video/mp4" />
    Tu navegador no soporta la reproducción de video.
  </video>
  <div class="overlay">
    <!-- Sección de tarjetas con título -->
    <div class="card-section">
      <div class="section-title">Obras Destacadas</div>
      <div class="card-grid">
        {#each cards as evento}
          <a href="/obras/{evento.obraPantalla}">
            <div class="hover-card">
              <HoverCard imageSrc={evento.obraImage[0]} title={evento.obraName} />
            </div>
          </a>
        {/each}
      </div>
    </div>
    <!-- Espacio para el video y figura -->
  </div>
</div>
