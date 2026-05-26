<script>
    let videoSource = "outerwilds.mp4";
</script>

<style>
    .video-container {
        position: relative;
        width: 100%;
        max-width: 1920px;
        margin: 0 auto;
        overflow: hidden;
        border-radius: 12px;
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.5);
        display: grid;
        grid-template-columns: 1fr 1fr; /* Divide en dos columnas iguales */
        align-items: center;
    }

    .video-container video {
        grid-column: span 2; /* El video ocupa ambas columnas */
        width: 100%;
        height: auto;
        filter: brightness(0.8) contrast(1.2) saturate(1.1);
        transition: filter 0.5s ease;
    }

    .video-container:hover video {
        filter: brightness(1) contrast(1.4) saturate(1.3);
    }

    .overlay {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 2rem;
        font-family: 'Orbitron', sans-serif;
        color: #fff;
        animation: fadeIn 2s ease-in-out;
    }

    .overlay.text {
        grid-column: 1; /* Se coloca en la primera columna */
        background: radial-gradient(circle, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 70%, rgba(0, 0, 0, 1) 100%);
        text-align: left;
    }

    .overlay.map {
        grid-column: 2; /* Se coloca en la segunda columna */
        text-align: center;
    }

    .title {
        font-size: 2rem;
        font-weight: bold;
        margin-bottom: 1rem;
        color: #00d4ff;
        text-shadow: 0 0 20px #00d4ff, 0 0 30px #00aaff;
    }

    .subtitle {
        font-size: 1rem;
        font-weight: 300;
        line-height: 1.5;
        color: #d1e9ff;
        text-shadow: 0 0 10px #0077ff, 0 0 20px #0057ff;
    }

    iframe {
        border: none;
        width: 100%;
        height: 100%;
        border-radius: 12px;
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.5);
    }
</style>

<div class="video-container">
    <video autoplay muted loop playsinline>
        <source src={videoSource} type="video/mp4" />
        Tu navegador no soporta la reproducción de video.
    </video>
    <div class="overlay text">
        <div class="title">Explora el Cosmos</div>
        <div class="subtitle">
            Es un orgullo para nosotros, los chaqueños, haber construido un acontecimiento internacional de reconocimiento pleno en la escena escultórica mundial. Grandes escultores del mundo en escena y en acción, trabajando a cielo abierto y en público, esculpiendo piezas que tienen por destino las veredas de Resistencia. Y así se cierra el círculo virtuoso: la obra de arte que pasa a formar parte del paisaje cotidiano haciendo del arte un bien de todos.
        </div>
    </div>
    <div class="overlay map">
        <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3877.4016932270254!2d-58.98294772504339!3d-27.451034227805328!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94450c2e020c3455%3A0xb0322c7a23a998a!2sResistencia%2C%20Chaco!5e0!3m2!1sen!2sar!4v1693922801512!5m2!1sen!2sar" 
            allowfullscreen>
        </iframe>
    </div>
</div>