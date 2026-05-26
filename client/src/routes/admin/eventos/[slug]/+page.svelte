<script>
  // @ts-nocheck
  import { onMount } from 'svelte';
  import axios from 'axios';
  import { page } from "$app/stores";

  let userRole;
  let accesoPermitido = false;
  let mostrandoCarga = false;
  let mensaje = '';

  /**
   * @type {string}
   */
  let slug;
  $: slug = $page.params.slug;
  let evento;
  let nombre;
  let lugar;
  let tematica;
  let fecha_inicio;
  let fecha_fin;
  let hora_inicio;
  let hora_fin;
  let fecha_original;

  const meses = {
    "enero": "January",
    "febrero": "February",
    "marzo": "March",
    "abril": "April",
    "mayo": "May",
    "junio": "June",
    "julio": "July",
    "agosto": "August",
    "septiembre": "September",
    "octubre": "October",
    "noviembre": "November",
    "diciembre": "December"
  };

  onMount(() => {
    userRole = localStorage.getItem('role');
    if (userRole === 'admin') {
      accesoPermitido = true;
      obtenerDatosEvento(); // Cargar datos del evento al montar la página
    } else {
      alert('Acceso denegado. Redirigiendo a la página principal.');
      window.location.href = '/inicio';
    }
  });

  const formatFecha = (fechaEntrada) => {
    const [dia, mes] = fechaEntrada.toLowerCase().split(' de ');
    const fecha = new Date(`${meses[mes]} ${dia}, ${new Date().getFullYear()}`);
    const year = fecha.getFullYear();
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Mes de 2 dígitos
    const day = fecha.getDate().toString().padStart(2, '0'); // Día de 2 dígitos
    return `${year}-${month}-${day}`;
  };

  async function obtenerDatosEvento() {
    mostrandoCarga = true;
    try {
      const res = await axios.get(`http://localhost:3001/api/eventos/${slug}`, {
        params: { nombre: slug },
      });
      evento = res.data.evento;
      nombre = evento.eventName;
      lugar = evento.location;
      tematica = evento.content;
      const fecha_inicio = formatFecha(evento.eventStartDate);
      const fecha_fin = formatFecha(evento.eventFinishDate);
      fecha_original = evento.eventStartDate + ' al ' + evento.eventFinishDate
      hora_inicio = evento.startTime;
      hora_fin = evento.finishTime;
    } catch (error) {
      console.error('Error al obtener los datos del evento:', error);
      mensaje = 'No se pudo cargar la información del evento.';
    } finally {
      mostrandoCarga = false;
    }
  }

  async function modificarEvento() {
    mostrandoCarga = true;
    try {
      const eventoActualizado = {
        nombre_evento_actual: nombre,
        lugar_evento_actual: lugar,
        nombre_evento_nuevo: nombre,
        lugar_evento_nuevo: lugar,
        fecha_inicio,
        fecha_fin,
        tematica,
        hora_inicio,
        hora_fin,
      };

      const res = await axios.post(`http://localhost:3001/api/modificarEvento`, eventoActualizado);
      mensaje = res.data.mensaje || 'Evento modificado con éxito';
    } catch (error) {
      console.error('Error al modificar el evento:', error);
      mensaje = 'Error al modificar el evento. Por favor, intenta de nuevo.';
    } finally {
      mostrandoCarga = false;
    }
  }
</script>

{#if accesoPermitido}
  {#if mostrandoCarga}
    <div class="loading-icon"></div>
  {:else}

  <div class="form-container">
    <h1>Modificar Evento</h1>
    <form on:submit|preventDefault={modificarEvento}>
      <input bind:value={nombre} placeholder="Nombre del evento" required />
      <input bind:value={lugar} placeholder="Lugar del evento" required />
      <input bind:value={tematica} placeholder="Temática" required />
      <p>Fecha original: {fecha_original}</p>
      <input type="date" bind:value={fecha_inicio} placeholder="Fecha inicio" required />
      <input type="date" bind:value={fecha_fin} placeholder="Fecha fin" required />
      <input type="time" bind:value={hora_inicio} placeholder="Hora inicio" required />
      <input type="time" bind:value={hora_fin} placeholder="Hora fin" required />
      <button type="submit">Modificar</button>
      <button class="btn-volver" on:click={() => (window.location.href = '/admin/eventos')}>Volver</button>
    </form>
    {#if mensaje}
      <p class="mensaje">{mensaje}</p>
    {/if}
  </div>
  {/if}
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
