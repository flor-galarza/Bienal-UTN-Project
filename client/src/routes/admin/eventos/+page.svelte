<script>
  // @ts-nocheck
  import { onMount } from 'svelte';
  import axios from 'axios';

  let eventos = [];  // Inicializamos un array vacío para los eventos.

  // Función para obtener eventos desde la API
  async function fetchEventos(query = "", criterio = 'nombre', orden = 'ASC') {
      try {
          const res = await axios.get(`http://localhost:3001/api/eventos`, {
              params: {
                  search: query,     // Parámetro de búsqueda
                  sortBy: criterio,  // Criterio de ordenación (nombre, f_creacion, promedio)
                  order: orden       // Orden (asc o desc)
              }
          });
          
          // Asegurarse de que los nombres de los campos coincidan con los datos que devuelve la API.
          eventos = res.data.map(evento => ({
              nombre: evento.eventName,  // Asegúrate de que 'eventName' sea el nombre correcto en la respuesta
              lugar: evento.location,    // Asegúrate de que 'location' sea el nombre correcto en la respuesta
              tematica: evento.content,   // Asegúrate de que 'theme' sea el nombre correcto en la respuesta
              url: evento.eventoPantalla
          }));
      } catch (error) {
          console.log(error);
          eventos = [];  // Si hay un error, asignamos un array vacío
      }
  }

  // Llamar la función de fetch cuando el componente se monte
  onMount(() => {
      fetchEventos();
  });

  const editarEvento = (id) => {
      console.log(`Editar evento con ID: ${id}`);
      // Lógica para editar
  };

  // Función para borrar evento
  const borrarEvento = async (nombre_evento, lugar_evento) => {
        try {
            const res = await axios.post('http://localhost:3001/api/borrarEvento', {
                nombre_evento: nombre_evento,
                lugar_evento: lugar_evento
            });

            // Verificar que el evento fue borrado exitosamente
            if (res.status === 200) {
                alert('Evento borrado con éxito');
                // Recargar la lista de eventos después de borrar uno
                fetchEventos();
            }
        } catch (error) {
            console.error('Error al borrar el evento:', error);
            alert('Error al borrar el evento');
        }
  };

  const redirigir = (ruta, slug) => {
      window.location.href = ruta+slug; // Redirige a la ruta especificada
  };

  const redirigirAlta = (ruta) => {
      window.location.href = '/admin/eventos/alta_evento'; // Redirige a la ruta especificada
  };


  const confirmar = () => {
      console.log('Acción confirmada');
      // Lógica para confirmar
  };

  const volver = () => {
      window.location.href = '/admin';
  };
</script>

<style>

  .header {
      text-align: center;
      margin: 20px auto;
  }

  h1 {
      margin: 0;
      font-size: 24px;
      color: #333;
      font-weight: bold;
  }

  .container {
      display: flex;
      align-items: flex-start;
  }

  .botones-izquierda {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-left: 20px;
      margin-top: 20px;
      gap: 10px;
  }

  .btn-azul {
      background-color: #3498db;
      color: white;
      border: none;
      cursor: pointer;
      padding: 10px 20px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: bold;
      text-transform: uppercase;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  }

  .btn-rojo {
      background-color: #e74c3c;
      color: white;
      border: none;
      cursor: pointer;
      padding: 10px 20px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: bold;
      text-transform: uppercase;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  }

  .btn-azul:hover {
      background-color: #2980b9;
  }

  .btn-rojo:hover {
      background-color: #c0392b;
  }

  table {
      width: 70%;
      margin: 0 auto;
      border-collapse: collapse;
      background: white;
      box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      overflow: hidden;
  }

  th, td {
      padding: 12px 15px;
      text-align: left;
      border-bottom: 1px solid #ddd;
  }

  th {
      background-color: #4CAF50;
      color: white;
      font-weight: bold;
      text-transform: uppercase;
  }

  td {
      color: #333;
  }

  tr:hover {
      background-color: #f1f1f1;
  }

  .acciones {
      display: flex;
      justify-content: center;
      gap: 10px;
  }

  .btn-editar {
      background-color: #fbc531;
      border: none;
      cursor: pointer;
      padding: 5px 12px;
      border-radius: 4px;
      font-weight: bold;
      color: white;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  }

  .btn-eliminar {
      background-color: #e84118;
      border: none;
      cursor: pointer;
      padding: 5px 12px;
      border-radius: 4px;
      font-weight: bold;
      color: white;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  }

  .btn-editar:hover {
      background-color: #f5c327;
  }

  .btn-eliminar:hover {
      background-color: #d63031;
  }
</style>

<div class="header">
  <h1>Lista de Eventos</h1>
</div>

<div class="container">
  <div class="botones-izquierda">
      <button class="btn-azul" on:click={() => redirigirAlta()}>Agregar Evento</button>
      <button class="btn-rojo" on:click={volver}>Volver</button>
  </div>

  <table>
      <thead>
          <tr>
              <th>Nombre</th>
              <th>Lugar</th>
              <th>Temática</th>
              <th>Acciones</th>
          </tr>
      </thead>
      <tbody>
          {#each eventos as { nombre, lugar, tematica, url }}
              <tr>
                  <td>{nombre}</td>
                  <td>{lugar}</td>
                  <td>{tematica}</td>
                  <td class="acciones">
                      <button class="btn-editar" on:click={() => redirigir('/admin/eventos/', url)}>✏️</button>
                      <button class="btn-eliminar" on:click={() => borrarEvento(nombre, lugar)}>❌</button>
                  </td>
              </tr>
          {/each}
      </tbody>
  </table>
</div>