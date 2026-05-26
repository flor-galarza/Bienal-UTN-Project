<script>
    import { onMount } from 'svelte';

  let userRole;
  let accesoPermitido = false; // Variable para controlar el acceso

  onMount(() => {
    userRole = localStorage.getItem('role');

    // Verifica si el usuario tiene el rol adecuado
    if (userRole === 'admin') {
      accesoPermitido = true; // Permite el acceso si es administrador
    } else {
      alert('Acceso denegado. Redirigiendo a la página principal.');
      window.location.href = '/inicio';
    }
  });
  import axios from 'axios';

  let nombre = '';
  let lugar = '';
  let tematica = '';
  let fecha_inicio = '';
  let fecha_fin = '';
  let hora_inicio = '';
  let hora_fin = '';
  let mensaje = '';
  let mostrandoCarga = false;

  // Función para enviar el evento al backend
  async function enviarEvento() {
    mostrandoCarga = true;
    try {
      const nuevoEvento = {
        nombre,
        lugar,
        tematica,
        fecha_inicio,
        fecha_fin,
        hora_inicio,
        hora_fin,
      };
      const res = await axios.post('http://localhost:3001/api/eventoNuevo', nuevoEvento);
      mensaje = res.data.mensaje || 'Evento creado con éxito';
    } catch (error) {
      console.error(error);
      mensaje = 'Error al enviar el evento. Por favor, intenta de nuevo.';
    } finally {
      mostrandoCarga = false;
    }
  }
</script>

{#if accesoPermitido}

  <!-- Mostrar el ícono de carga mientras se realiza la solicitud -->
  {#if mostrandoCarga}
    <div class="loading-icon"></div>
  {/if}

  <div class="form-container">
    <h1>Crear Evento</h1>
    <form on:submit|preventDefault="{enviarEvento}">
      <input bind:value="{nombre}" placeholder="Nombre del evento" required />
      <input bind:value="{lugar}" placeholder="Lugar del evento" required />
      <input bind:value="{tematica}" placeholder="Temática" required />
      <input type="date" bind:value="{fecha_inicio}" placeholder="Fecha inicio" required />
      <input type="date" bind:value="{fecha_fin}" placeholder="Fecha fin" required />
      <input type="time" bind:value="{hora_inicio}" placeholder="Hora inicio" required />
      <input type="time" bind:value="{hora_fin}" placeholder="Hora fin" required />
      <button type="submit">Enviar</button>
      <button class="btn-volver" on:click={() => (window.location.href = '/admin/eventos')}>Volver</button>
    </form>

    <!-- Mostrar el mensaje de éxito o error -->
    {#if mensaje}
      <p class="mensaje">{mensaje}</p>
    {/if}
  </div>
{/if}

<style>
  .form-container {
    max-width: 400px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
  }

  input, button {
    display: block;
    width: 100%;
    margin-bottom: 15px;
    padding: 10px;
    font-size: 16px;
    border-radius: 4px;
  }

  button {
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3;
  }

  .mensaje {
    text-align: center;
    font-size: 16px;
    color: green;
  }

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
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

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
</style>
