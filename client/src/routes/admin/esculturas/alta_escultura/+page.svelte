<script>
  import { onMount } from 'svelte';
  import axios from "axios";
  
  let userRole;
  let accesoPermitido = false;

  onMount(() => {
    userRole = localStorage.getItem('role');
    if (userRole === 'admin') {
      accesoPermitido = true;
    } else {
      alert('Acceso denegado. Redirigiendo a la página principal.');
      window.location.href = '/inicio';
    }
  });

  let artistas = [];
  let eventos = [];
  let nombre = '';
  let fechaCreacion = '';
  let tecnica = '';
    let etapa = ''
  let antecedentes = '';
  let artistasSeleccionados = [];
  let eventosSeleccionados = [];
  let imagenes = [];
  let filtroArtistas = ''; // Para filtrar artistas
  let filtroEventos = ''; // Para filtrar eventos
  let mostrarArtistas = false; // Controla la visibilidad del menú de artistas
  let mostrarEventos = false; // Controla la visibilidad del menú de eventos

  onMount(async () => {
    artistas = await fetchArtistas();
    eventos = await fetchEventos();
  });
  
  async function fetchArtistas(query = "", criterio = 'nombre', orden = 'ASC') {
    try {
        const res = await axios.get(`http://localhost:3001/api/escultores`, {
            params: {
                search: query,     // Parámetro de búsqueda
                sortBy: criterio,  // Criterio de ordenación (nombre, f_creacion, promedio)
                order: orden       // Orden (asc o desc)
            }
        });
        
        // Extrae solo los nombres de los eventos
        
        const artistasNames = res.data.map(artista => ({
          escultorName: artista.escultorName,
          DNI: artista.DNI
        }));

        console.log(artistasNames)

         
        
        return artistasNames;  // Devuelve solo los nombres

    } catch (error) {
        console.log(error);
        return [];  // Si hay un error, devuelve una lista vacía
    }
  }


  async function fetchEventos(query = "", criterio = 'nombre', orden = 'ASC') {
    try {
        const res = await axios.get(`http://localhost:3001/api/eventos`, {
            params: {
                search: query,     // Parámetro de búsqueda
                sortBy: criterio,  // Criterio de ordenación (nombre, f_creacion, promedio)
                order: orden       // Orden (asc o desc)
            }
        });
        
        // Extrae solo los nombres de los eventos
        
        const eventNames = res.data.map(eventos => eventos.eventName); 
        
        return eventNames;  // Devuelve solo los nombres

    } catch (error) {
        console.log(error);
        return [];  // Si hay un error, devuelve una lista vacía
    }
  }



  function handleFileChange(event) {
    imagenes = Array.from(event.target.files);
  }

  function seleccionarArtista(artista) {
    if (!artistasSeleccionados.some(sel => sel.escultorName === artista.escultorName)) {
      artistasSeleccionados = [...artistasSeleccionados, artista];
    }
  }

  function seleccionarEvento(evento) {
    if (!eventosSeleccionados.includes(evento)) {
      eventosSeleccionados = [...eventosSeleccionados, evento];
    }
    filtroEventos = ''; // Limpiar el filtro
  }

  function eliminarArtista(artista) {
    artistasSeleccionados = artistasSeleccionados.filter(a => a !== artista);
  }

  function eliminarEvento(evento) {
    eventosSeleccionados = eventosSeleccionados.filter(e => e !== evento);
  }

  async function enviarFormulario() {
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('f_creacion', fechaCreacion);
    formData.append('tecnica', tecnica);
    formData.append('antecedentes', antecedentes);

      // Agregar artistas seleccionados
    artistasSeleccionados.forEach(artista => {
      formData.append('artistas[]', artista);
    });

    // Agregar eventos seleccionados
    eventosSeleccionados.forEach(evento => {
      formData.append('eventos[]', evento);
    });

    // Agregar imágenes
    imagenes.forEach(imagen => {
      formData.append('imagenes', imagen);
    });

    let f_creacion = fechaCreacion
    
    console.log(artistasSeleccionados);
    
    console.log(eventosSeleccionados);
    
    console.log(imagenes);

    try {
      //Registrar escultura

      const esculturaRes = await axios.post('http://localhost:3001/api/esculturaNueva', {
          nombre,
          f_creacion,
          antecedentes,
          tecnica,
      });


      const nombre_escultura = nombre;
      

      // Registrar artistas relacionados
      for (const artista of artistasSeleccionados) {
        let DNI = artista.DNI
        await axios.post('http://localhost:3001/api/hechasPorNueva', {
          DNI,
          nombre_escultura,
        });
      }

      // Registrar eventos relacionados

      for (const evento of eventosSeleccionados) {
        let nombre_evento = evento
        
        await axios.post('http://localhost:3001/api/compitenNuevo', {
          nombre_evento,
          nombre_escultura,
        });
      }


      // Subir imágenes
      for (const imagen of imagenes) {
      try {
        if (!imagen) {
          console.error("La imagen es inválida o no existe.");
          continue;
        }

        // Crear FormData para cada imagen
        const imagenFormData = new FormData();
        imagenFormData.append('imagen', imagen);
        imagenFormData.append('etapa', 'registro');
        imagenFormData.append('nombre_escultura', nombre_escultura);

        // Subir la imagen a la API
        const response = await axios.post('http://localhost:3001/api/imagenNueva', imagenFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Verificar la respuesta
        if (response.status === 200) {
          console.log("Imagen subida con éxito:", response.data);
        } else {
          console.warn("Error al subir la imagen:", response.statusText);
        }
      } catch (error) {
        console.error("Error al subir una imagen:", error);
      }
    }


    alert('Escultura registrada con éxito');

      
    } catch (error) {
      console.error('Error al registrar la escultura o relaciones:', error);
      alert('Hubo un error al registrar la escultura. Intenta nuevamente.');
      
    }
    
  }
</script>

{#if accesoPermitido}
  <button class="btn-volver" on:click={() => (window.location.href = '/admin/esculturas')}>Volver</button>
  <section>
    <h1>Registrar Escultura</h1>
    <form on:submit|preventDefault={enviarFormulario} class="formulario">
      <div class="campo">
        <label for="nombre">Nombre de la escultura</label>
        <input type="text" id="nombre" bind:value={nombre} required />
      </div>

      <div class="campo">
        <label for="fechaCreacion">Fecha de creación</label>
        <input type="date" id="fechaCreacion" bind:value={fechaCreacion} required />
      </div>

      <div class="campo">
        <label for="tecnica">Técnica</label>
        <input type="text" id="tecnica" bind:value={tecnica} required />
      </div>

      <div class="campo">
        <label for="antecedentes">Antecedentes</label>
        <textarea id="antecedentes" bind:value={antecedentes} rows="4" required></textarea>
      </div>


      <!-- Mostrar artistas seleccionados -->
      <div class="artistas-seleccionados">
        <h3>Artistas seleccionados:</h3>
        <ul>
          {#each artistasSeleccionados as artista}
            <li>
              {artista.escultorName} 
              <button type="button" class="btn-cruz" on:click={() => eliminarArtista(artista)}>✖</button>
            </li>
          {/each}
        </ul>
      </div>

          <!-- Buscar y agregar artistas -->
      <div class="campo">
        <label for="artistasSeleccionados">Buscar Artista</label>
        <div class="buscador">
          <input
            type="text"
            placeholder="Buscar artista..."
            bind:value={filtroArtistas}
            on:focus={() => (mostrarArtistas = true)}
          />
          <button type="button" class="btn-toggle" on:click={() => (mostrarArtistas = !mostrarArtistas)}>
            {mostrarArtistas ? '▲' : '▼'}
          </button>
        </div>
        {#if mostrarArtistas}
          <select
            id="artistasSeleccionados"
            size="5"
            on:change={(e) => seleccionarArtista(artistas.find(artista => artista.escultorName === e.target.value))}
          >
            {#each artistas.filter(artista => 
              artista.escultorName && 
              artista.escultorName.toLowerCase().includes(filtroArtistas.toLowerCase()) && 
              !artistasSeleccionados.some(sel => sel.escultorName === artista.escultorName)) as artista}
              <option value={artista.escultorName}>{artista.escultorName}</option>
            {/each}
          </select>
        {/if}
      </div>




      <!-- Eventos seleccionados -->
      <div class="campo">
        <label>Eventos seleccionados:</label>
        <ul>
          {#each eventosSeleccionados as evento}
            <li>
              {evento} 
              <button type="button" class="btn-cruz" on:click={() => eliminarEvento(evento)}>✖</button>
            </li>
          {/each}
        </ul>
      </div>

      <!-- Buscar y agregar eventos -->
      <div class="campo">
        <label for="eventosSeleccionados">Buscar Evento</label>
        <div class="buscador">
          <input
            type="text"
            placeholder="Buscar evento..."
            bind:value={filtroEventos}
            on:focus={() => (mostrarEventos = true)}
          />
          <button type="button" class="btn-toggle" on:click={() => (mostrarEventos = !mostrarEventos)}>
            {mostrarEventos ? '▲' : '▼'}
          </button>
        </div>
        {#if mostrarEventos}
          <select
            id="eventosSeleccionados"
            bind:value={filtroEventos}
            size="5"
            on:change={() => seleccionarEvento(filtroEventos)}
          >
            {#each eventos.filter(evento => evento.toLowerCase().includes(filtroEventos.toLowerCase()) && !eventosSeleccionados.includes(evento)) as evento}
              <option value={evento}>{evento}</option>
            {/each}
          </select>
        {/if}
      </div>

      <div class="campo">
        <label for="imagenes">Imágenes de la escultura</label>
        <input type="file" id="imagenes" multiple on:change={handleFileChange} />
      </div>

      <button type="submit">Registrar Escultura</button>
    </form>
  </section>
{/if}

<style>
  .btn-volver {
    background-color: #dc3545;
    color: white;
    padding: 10px 15px;
    font-size: 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 20px;
  }

  .btn-volver:hover {
    background-color: #b02a37;
  }
  
  section {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  h1 {
    text-align: center;
    margin-bottom: 20px;
  }

  .formulario {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .campo {
    display: flex;
    flex-direction: column;
  }

  label {
    font-weight: bold;
    margin-bottom: 5px;
  }

  input, select, textarea, button {
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  button {
    background-color: #007BFF;
    color: white;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  button:hover {
    background-color: #0056b3;
  }

  .btn-cruz {
    margin-left: 10px;
    background-color: transparent;
    border: none;
    color: red;
    font-size: 18px;
    cursor: pointer;
  }

  .btn-cruz:hover {
    color: darkred;
  }

  .buscador {
    display: flex;
    align-items: center;
  }

  .btn-toggle {
    margin-left: 5px;
    background-color: transparent;
    border: none;
    font-size: 16px;
    cursor: pointer;
  }

  .btn-toggle:hover {
    color: #007BFF;
  }
</style>
