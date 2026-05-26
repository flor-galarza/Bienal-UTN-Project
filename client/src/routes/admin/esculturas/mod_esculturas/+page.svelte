<script>
    import { onMount } from 'svelte';
    import axios from 'axios';
  
    let userRole;
    let accesoPermitido = false;
    let mostrandoCarga = false;
    let mensaje = '';
  
    let id = ''; // ID de la escultura a modificar
    let nombre = '';
    let fechaCreacion = '';
    let tecnica = '';
    let antecedentes = '';
    let artistas = [];
    let eventos = [];
    let artistasSeleccionados = [];
    let eventosSeleccionados = [];
    let imagenes = [];
    let filtroArtistas = '';
    let filtroEventos = '';
    let mostrarArtistas = false;
    let mostrarEventos = false;
  
    onMount(() => {
      userRole = localStorage.getItem('role');
      if (userRole === 'admin') {
        accesoPermitido = true;
        obtenerDatosEscultura(); // Cargar datos de la escultura al montar la página
      } else {
        alert('Acceso denegado. Redirigiendo a la página principal.');
        window.location.href = '/inicio';
      }
    });
  
    async function obtenerDatosEscultura() {
      mostrandoCarga = true;
      try {
        const res = await axios.get(`http://localhost:3001/api/escultura/${id}`);
        const data = res.data;
        nombre = data.nombre;
        fechaCreacion = data.fechaCreacion;
        tecnica = data.tecnica;
        antecedentes = data.antecedentes;
        artistasSeleccionados = data.artistas || [];
        eventosSeleccionados = data.eventos || [];
      } catch (error) {
        console.error('Error al obtener los datos de la escultura:', error);
        mensaje = 'No se pudo cargar la información de la escultura.';
      } finally {
        mostrandoCarga = false;
      }
    }
  
    async function enviarFormulario() {
      mostrandoCarga = true;
      try {
        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('fechaCreacion', fechaCreacion);
        formData.append('tecnica', tecnica);
        formData.append('antecedentes', antecedentes);
  
        artistasSeleccionados.forEach((artista) => {
          formData.append('artistas[]', artista);
        });
  
        eventosSeleccionados.forEach((evento) => {
          formData.append('eventos[]', evento);
        });
  
        imagenes.forEach((imagen) => {
          formData.append('imagenes', imagen);
        });
  
        const res = await axios.put(`http://localhost:3001/api/escultura/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        mensaje = res.data.mensaje || 'Escultura modificada con éxito';
      } catch (error) {
        console.error('Error al modificar la escultura:', error);
        mensaje = 'Error al modificar la escultura. Por favor, intenta de nuevo.';
      } finally {
        mostrandoCarga = false;
      }
    }
  
    function handleFileChange(event) {
      imagenes = Array.from(event.target.files);
    }
  
    function eliminarArtista(artista) {
      artistasSeleccionados = artistasSeleccionados.filter((a) => a !== artista);
    }
  
    function eliminarEvento(evento) {
      eventosSeleccionados = eventosSeleccionados.filter((e) => e !== evento);
    }
  </script>
  
  {#if accesoPermitido}
    {#if mostrandoCarga}
      <div class="loading-icon"></div>
    {/if}
  
    <button class="btn-volver" on:click={() => (window.location.href = '/admin/esculturas')}>Volver</button>
    <section>
      <h1>Modificar Escultura</h1>
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
        <div class="campo">
          <label>Artistas seleccionados:</label>
          <ul>
            {#each artistasSeleccionados as artista}
              <li>
                {artista}
                <button type="button" class="btn-cruz" on:click={() => eliminarArtista(artista)}>✖</button>
              </li>
            {/each}
          </ul>
        </div>
  
        <!-- Mostrar eventos seleccionados -->
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
  
        <div class="campo">
          <label for="imagenes">Actualizar imágenes de la escultura</label>
          <input type="file" id="imagenes" multiple on:change={handleFileChange} />
        </div>
  
        <button type="submit">Modificar Escultura</button>
      </form>
  
      {#if mensaje}
        <p class="mensaje">{mensaje}</p>
      {/if}
    </section>
  {/if}
  
  <style>
    /* Igual que la página de registro, con un botón adicional para volver */
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
  
    input, textarea, button {
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
  </style>
  