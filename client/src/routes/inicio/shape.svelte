<script>
    export let imageSrc = ""; // URL de la imagen
    export let title = ""; // Texto que aparecerá al hacer hover
    export let width = "150px"; // Ancho del contenedor
    export let height = "150px"; // Alto del contenedor
  </script>
  
  <style>
    .container {
      position: relative;
      width: var(--width);
      height: var(--height);
      overflow: hidden;
      border-radius: 10px; /* Ajusta el radio del borde si lo deseas */
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Agrega sombra opcional */
    }
  
    .image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: filter 0.3s ease, transform 0.3s ease;
    }
  
    .text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 0.8rem; /* Ajustamos el tamaño del texto */
      font-weight: bold;
      text-align: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
      text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.8);
    }
  
    .container:hover .image {
      filter: blur(5px);
      transform: scale(1.1);
    }
  
    .container:hover .text {
      opacity: 1;
    }
  </style>
  
  <div
    class="container"
    style="--width: {width}; --height: {height};"
  >
    <img src={imageSrc} alt={title} class="image" />
    <div class="text">{title}</div>
  </div>
  