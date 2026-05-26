<script>
    let videoSource = "megamind.mp4";
  </script>
  
  <style>
    .video-container {
      position: relative;
      width: 100%;
      max-width: 1920px;
      margin: 0 auto;
      overflow: hidden;
      border-radius: 12px;
      background-color: #ffffff; /* Fondo blanco */
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
      transform: translateZ(0); /* Activa la aceleración por hardware */

    }
  
    .video-container:hover video {
      filter: brightness(1.1) saturate(1.5) contrast(1.3) hue-rotate(15deg);
    }
  
    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.3) 60%, rgba(255, 255, 255, 0.8) 100%);
      color: #000; /* Texto negro para mayor contraste con el fondo blanco */
      text-align: center;
      padding: 1.5rem;
      font-family: 'Montserrat', sans-serif;
      animation: fadeIn 2s ease-in-out;
    }
  
    @keyframes fadeIn {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
  
    .title {
      font-size: 3rem;
      font-weight: bold;
      margin-bottom: 1rem;
      text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      animation: slideIn 1.5s ease-out;
    }
  
    @keyframes slideIn {
      0% {
        transform: translateY(-50%);
        opacity: 0;
      }
      100% {
        transform: translateY(0);
        opacity: 1;
      }
    }
  
    .subtitle {
      font-size: 1.8rem;
      font-weight: 300;
      line-height: 1.5;
      text-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      animation: slideIn 2s ease-out;
      animation-delay: 0.5s;
    }
  
    @keyframes hueShift {
      0% {
        filter: hue-rotate(0deg);
      }
      100% {
        filter: hue-rotate(360deg);
      }
    }
  
    .video-container:hover video {
      animation: hueShift 5s infinite linear;
    }
  </style>
  
  <div class="video-container">
    <video autoplay muted loop playsinline>
      <source src={videoSource} type="video/mp4" />
      Tu navegador no soporta la reproducción de video.
    </video>
    <div class="overlay">
      <div class="title">Bienal del Chaco 2024</div>
      <div class="subtitle">
        Del 13 al 21 de julio, Resistencia, Chaco.  
        Vive el arte, conecta con la naturaleza y la creatividad en una experiencia inolvidable.
      </div>
    </div>
  </div>
  