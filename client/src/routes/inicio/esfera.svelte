<script>
  import Tarjetas from "./tarjetas.svelte";
  let imageSource = "fondobienal2018v3.jpg"; // Ruta de la imagen
</script>

<style>
  .image-container {
      position: relative;
      width: 100%;
      max-width: 1920px;
      margin: 0 auto;
      overflow: hidden;
      border-radius: 12px;
      box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
      transition: transform 0.5s ease, box-shadow 0.5s ease;
  }

  .image-container:hover {
      transform: scale(1.02);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  }

  .image-container img {
      width: 100%;
      height: auto;
      filter: brightness(0.9) saturate(1.2) contrast(1.1) sepia(0.1);
      transition: filter 0.5s ease;
  }

  .image-container:hover img {
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
      background: linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.3) 60%, rgba(0, 0, 0, 0.8) 100%);
      color: #000000;
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
      text-shadow: 0 4px 8px rgba(0, 0, 0, 0.6);
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
      text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
      animation: slideIn 2s ease-out;
      animation-delay: 0.5s;
  }
</style>

<div class="image-container">
  <img src={imageSource} alt="Imagen destacada" />
  <div class="overlay">
      <div class="title">Artistas Destacados</div>
      <div class="subtitle">
          <Tarjetas />
      </div>
  </div>
</div>
