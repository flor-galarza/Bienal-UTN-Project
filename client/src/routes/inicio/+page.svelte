<script>
  // @ts-nocheck
  import { onMount } from 'svelte';
  import Caras from './caras.svelte';
  import Esfera from './esfera.svelte';
  import Robo from './robo.svelte';

  let sections;
  let isScrolling = false;
  let lastHoveredSection = null;

  onMount(() => {
    sections = document.querySelectorAll('.full-page');

    const scrollToSection = (section) => {
      if (isScrolling || !section) return;

      isScrolling = true;
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });

      setTimeout(() => {
        isScrolling = false;
      }, 800); // Tiempo de espera para evitar scrolls repetidos
    };

    const mouseHandler = (event) => {
      if (isScrolling) return;

      const hoveredSection = Array.from(sections).find((section) => {
        const rect = section.getBoundingClientRect();
        return (
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom &&
          event.clientX >= rect.left &&
          event.clientX <= rect.right
        );
      });

      if (hoveredSection && hoveredSection !== lastHoveredSection) {
        lastHoveredSection = hoveredSection;
        scrollToSection(hoveredSection);
      }
    };

    const touchHandler = (event) => {
      const touch = event.changedTouches[0];
      mouseHandler({
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
    };

    window.addEventListener('mousemove', mouseHandler);
    window.addEventListener('touchmove', touchHandler);

    return () => {
      window.removeEventListener('mousemove', mouseHandler);
      window.removeEventListener('touchmove', touchHandler);
    };
  });
</script>

<style>
  body {
    margin: 0;
    overflow: hidden; /* Evitar el scroll manual */
  }

  .container {
    display: flex;
    flex-direction: column;
    scroll-snap-type: y mandatory; /* Forzar que las secciones se alineen */
  }

  .full-page {
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    scroll-snap-align: start; /* Alinear las secciones al inicio */
    overflow: hidden;
    background: #f0f0f0;
  }

  iframe {
    border: 0;
    width: 100%;
    height: 100%;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 80%;
    max-width: 400px;
  }

  input, textarea, button {
    font-size: 16px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  button {
    background-color: #007BFF;
    color: white;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3;
  }

  /* Ajustes para el mapa y el formulario */
  .responsive-container {
    display: flex;
    flex-wrap: wrap; /* Para que los elementos pasen a columna en pantallas pequeñas */
    width: 100%;
    height: auto;
  }

  .map, .form-info {
    flex: 1 1 50%; /* Ocupa 50% cada uno en pantallas grandes */
    min-width: 300px; /* Evita que sea muy pequeño */
    height: 100%;
    box-sizing: border-box;
  }

  .map iframe {
    width: 100%;
    height: 100%;
  }

  .form-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .form-info {
    padding: 20px;
    text-align: center;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  h2 {
    font-size: 1.5rem;
  }

  p {
    font-size: 1rem;
  }

  /* Media Queries para pantallas pequeñas */
  @media (max-width: 768px) {
    .responsive-container {
      flex-direction: column; /* Cambia de fila a columna */
    }

    .map, .form-info {
      width: 100%; /* Ocupan todo el ancho */
      min-height: 50vh; /* Ajusta la altura mínima */
    }

    form {
      width: 100%; /* Asegura que el formulario use el ancho disponible */
      padding: 10px;
    }

    h2 {
      font-size: 1.25rem; /* Reduce tamaño de texto */
    }

    p {
      font-size: 0.875rem; /* Ajusta tamaño de texto */
    }

    /* General: eliminar anchos fijos */
.container, .full-page {
  width: 100%; /* Asegura que ocupe todo el ancho */
  height: 100vh; /* Altura total de la pantalla */
}

/* Formulario y mapa responsivos */
.responsive-container {
  flex-direction: column; /* Cambiar de fila a columna */
}

.map, .form-info {
  width: 100%; /* Asegura que cada sección ocupe el ancho total */
  height: auto; /* Ajusta la altura automáticamente */
  min-height: 50vh; /* Altura mínima */
}

/* Estilo del iframe (Google Maps) */
.map iframe {
  width: 100%; /* Ancho completo */
  height: 100%; /* Altura completa */
}

/* Contenedor del formulario */
.form-container {
  width: 100%; /* Asegura que use todo el espacio disponible */
  padding: 10px; /* Reducir padding en dispositivos pequeños */
}

/* Texto y botones más pequeños en pantallas pequeñas */
form, input, textarea, button {
  font-size: 0.9rem; /* Reducir el tamaño de texto */
}

h2, p {
  font-size: 1rem; /* Ajustar encabezados y párrafos */
}

/* Media Query para dispositivos muy pequeños */
@media (max-width: 480px) {
  .responsive-container {
    flex-direction: column; /* Organizar en columna */
  }

  form {
    gap: 8px; /* Menor espacio entre los campos */
  }

  button {
    padding: 8px; /* Botones más compactos */
  }

  h2 {
    font-size: 1.2rem; /* Ajusta el tamaño del título */
  }
}

  }

  @media (max-width: 480px) {
    form {
      gap: 5px; /* Reduce espacio entre campos */
    }

    input, textarea, button {
      font-size: 0.875rem; /* Tamaño más pequeño */
    }

    button {
      padding: 8px 16px; /* Botón más compacto */
    }
  }
</style>

<div class="container">
  <div class="full-page">
    <Caras />
  </div>

  <div class="full-page">
    <Esfera />
  </div>

  <div class="full-page">
    <Robo />
  </div>
</div>
<div style="display: flex; height: 100vh; width: 100%; margin: 0; padding: 0; overflow: hidden;">
  <!-- Sección del mapa -->
  <div style="width: 50%; height: 100%; display: flex;">
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14164.111884754428!2d-58.981349!3d-27.437239!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94450c5b052eb443%3A0x891619c21777887b!2sPredio%20de%20las%20Bienales!5e0!3m2!1ses-419!2sus!4v1733408348178!5m2!1ses-419!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade">
      allowfullscreen=""
      loading="lazy"
      style="border: none; width: 100%; height: 100%;"
    ></iframe>
  </div>

  <div style="display: flex; height: 100vh; width: 100%; background: url('outerwilds-photoaidcom-invert.jpg') no-repeat center center; background-size: cover; font-family: Arial, sans-serif; color: black; padding: 20px; box-sizing: border-box; justify-content: center; align-items: center; position: relative;">
    <!-- Filtro oscuro para resaltar el contenido -->
    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 0;"></div>
  
    <!-- Contenido principal -->
    <div style="z-index: 1; display: flex; width: 100%; justify-content: center; align-items: center; gap: 20px;">
  
      <!-- Sección del formulario -->
      <div style="width: 45%; margin: 10px; background: rgba(255, 255, 255, 0.9); padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); display: flex; flex-direction: column; justify-content: center;">
        <form style="width: 100%; display: flex; flex-direction: column; gap: 15px;">
          <label for="name" style="font-weight: bold;">Apellido y Nombre (requerido)</label>
          <input type="text" id="name" name="name" placeholder="Tu nombre" required style="padding: 10px; font-size: 16px; border: 1px solid #ccc; border-radius: 5px; outline: none;" />
  
          <label for="email" style="font-weight: bold;">Email (requerido)</label>
          <input type="email" id="email" name="email" placeholder="Tu correo electrónico" required style="padding: 10px; font-size: 16px; border: 1px solid #ccc; border-radius: 5px; outline: none;" />
  
          <label for="subject" style="font-weight: bold;">Asunto</label>
          <input type="text" id="subject" name="subject" placeholder="Asunto" style="padding: 10px; font-size: 16px; border: 1px solid #ccc; border-radius: 5px; outline: none;" />
  
          <label for="message" style="font-weight: bold;">Consulta / Mensaje</label>
          <textarea id="message" name="message" rows="4" placeholder="Tu mensaje" required style="padding: 10px; font-size: 16px; border: 1px solid #ccc; border-radius: 5px; outline: none; resize: none;"></textarea>
  
          <button type="submit" style="padding: 10px 20px; font-size: 16px; border: none; border-radius: 5px; background-color: black; color: white; cursor: pointer; font-weight: bold;">Enviar</button>
        </form>
      </div>
  
      <!-- Sección de información -->
      <div style="width: 45%; margin: 10px; background: rgba(255, 255, 255, 0.9); padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
        <h2 style="margin: 0 0 20px 0; font-weight: bold;">Visite la Bienal</h2>
        <p style="margin: 5px 0;">
          Avenida de los Inmigrantes 1001 – H3504DMA<br />
          Resistencia, Chaco – Argentina
        </p>
        <p style="margin: 5px 0;">
          Tel: +54 362 425-1861<br />
          <a href="mailto:urunday@bienaldelchaco.com" style="color: black; text-decoration: none; font-weight: bold;">urunday@bienaldelchaco.com</a>
        </p>
      </div>
    </div>
  </div>
    
  
</div> 